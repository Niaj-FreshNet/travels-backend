import prisma from "../../config/db.js";
import paginate from "../../utils/paginate.js";
import {
    ROLES,
    ACCOUNT_TYPES,
    MODES,
    POST_STATUS,
    PAYMENT_STATUS,
} from "./sales.constant.js";

class SalesServices {
    // Get all sales with pagination and filters
    async getAllSales({ user, query }) {
        const { role, email, officeId } = user;

        let where = {};

        // Permission-based filters
        if (role === ROLES.SALES) where.createdBy = email;
        else if (role === ROLES.ADMIN) where.officeId = officeId;

        // Query filters
        if (query.postStatus) where.postStatus = query.postStatus;
        if (query.paymentStatus) where.paymentStatus = query.paymentStatus;
        if (query.accountType) where.accountType = query.accountType;

        // Date filters
        if (query.startDate || query.endDate) {
            where.date = {};
            if (query.startDate) where.date.gte = new Date(query.startDate);
            if (query.endDate) where.date.lte = new Date(query.endDate);
        }

        return paginate(prisma.sale, where, {
            page: query.page,
            limit: query.limit || 25,
            sort: query.sort || "-date",
            search: query.search,
            searchFields: [
                "documentNumber",
                "passengerName",
                "supplierName",
                "rvNumber",
                "sector",
                "airlineCode",
            ],
        });
    }

    // Get single sale by ID
    async getSaleById(id, user) {
        const { role, email, officeId } = user;

        const where = { id };

        if (role === ROLES.SALES) where.createdBy = email;
        if (role === ROLES.ADMIN) where.officeId = officeId;

        return prisma.sale.findFirst({ where });
    }

    // Get sales by supplier and payment status
    // Get sales by supplier and payment status with pagination
    async getSalesBySupplierPaymentStatus({ user, query }) {
        const { role, email, officeId } = user;
        const { supplierName, paymentStatus, postStatus } = query;

        if (!supplierName) throw new Error("Supplier name is required");

        let where = {
            supplierName: supplierName,
            paymentStatus: paymentStatus ? paymentStatus : { in: ["Paid", "Due"] },
        };

        // Role-based filtering
        if (role === ROLES.SALES) where.createdBy = email;
        if (role === ROLES.ADMIN) where.officeId = officeId;

        // Optional postStatus filter
        if (postStatus) where.postStatus = postStatus;

        // Optional date filters
        if (query.startDate || query.endDate) {
            where.date = {};
            if (query.startDate) where.date.gte = new Date(query.startDate);
            if (query.endDate) where.date.lte = new Date(query.endDate);
        }

        return paginate(prisma.sale, where, {
            page: query.page,
            limit: query.limit || 25,
            sort: query.sort || "-date",
            search: query.search,
            searchFields: [
                "documentNumber",
                "passengerName",
                "rvNumber",
                "sector",
                "airlineCode",
                "sellBy",
                "iataName",
            ],
        });
    }

    // Validate document number and generate next RV number
    async validateDocumentAndGenerateRV(documentNumber) {
        // Check if document exists
        const existingDocument = await prisma.sale.findFirst({
            where: { documentNumber },
        });

        // Get last RV number
        const lastSale = await prisma.sale.findFirst({
            orderBy: { createdAt: "desc" },
            select: { rvNumber: true },
        });

        let newRVNumber = "RV-0001";

        if (lastSale && lastSale.rvNumber) {
            const lastNumber = parseInt(lastSale.rvNumber.replace("RV-", ""), 10);
            newRVNumber = `RV-${String(lastNumber + 1).padStart(4, "0")}`;
        }

        return {
            exists: !!existingDocument,
            message: existingDocument
                ? "Document number already exists"
                : "Document number is available",
            lastRVNumber: newRVNumber,
        };
    }

    // Create new sale
    async createSale(data, user) {
        this._validateSaleData(data);

        const saleData = {
            ...data,
            sellPrice: Number(data.sellPrice) || 0,
            buyingPrice: Number(data.buyingPrice) || 0,
            createdBy: user.email,
            officeId: user.officeId,
            createdAt: new Date(),
            postStatus: data.postStatus || POST_STATUS.DRAFT,
            paymentStatus: data.paymentStatus || PAYMENT_STATUS.PENDING,
        };

        if (data.saveAndPost === "Yes") {
            saleData.postStatus = POST_STATUS.POSTED;
        }

        return prisma.sale.create({ data: saleData });
    }

    // Full update of sale
    async updateSale(id, data, user) {
        const { role, email, officeId } = user;

        const where = { id };
        if (role === ROLES.SALES) where.createdBy = email;
        if (role === ROLES.ADMIN) where.officeId = officeId;

        const existingSale = await prisma.sale.findFirst({ where });
        if (!existingSale) return null;

        this._validateSaleData(data, true);

        const { createdBy, officeId: _office, createdAt, ...updateData } = data;

        return prisma.sale.update({
            where: { id },
            data: updateData,
        });
    }

    // Partial update of sale (for PATCH /sale/:id)
    async partialUpdateSale(id, data, user) {
        const existingSale = await prisma.sale.findUnique({
            where: { id },
        });

        if (!existingSale) return null;

        // Extract only the fields that are being updated
        const updateData = {};

        const allowedFields = [
            "documentNumber",
            "airlineCode",
            "supplierName",
            "sellPrice",
            "buyingPrice",
            "mode",
            "remarks",
            "passengerName",
            "sector",
            "date",
        ];

        allowedFields.forEach((field) => {
            if (data[field] !== undefined) {
                updateData[field] = data[field];
            }
        });

        // Convert prices to numbers
        if (updateData.sellPrice !== undefined) {
            updateData.sellPrice = Number(updateData.sellPrice);
        }
        if (updateData.buyingPrice !== undefined) {
            updateData.buyingPrice = Number(updateData.buyingPrice);
        }

        return prisma.sale.update({
            where: { id },
            data: updateData,
        });
    }

    // Update post status
    async updatePostStatus(id, postStatus) {
        const sale = await prisma.sale.findUnique({
            where: { id },
        });

        if (!sale) return null;

        return prisma.sale.update({
            where: { id },
            data: { postStatus },
        });
    }

    // Update payment status
    async updatePaymentStatus(id, paymentStatus) {
        const sale = await prisma.sale.findUnique({
            where: { id },
        });

        if (!sale) return null;

        return prisma.sale.update({
            where: { id },
            data: { paymentStatus },
        });
    }

    // Mark sale as refunded
    async markAsRefunded(id, refundData) {
        const sale = await prisma.sale.findUnique({
            where: { id },
        });

        if (!sale) return null;

        return prisma.sale.update({
            where: { id },
            data: {
                refundDate: refundData.refundDate,
                refundCharge: refundData.refundCharge
                    ? Number(refundData.refundCharge)
                    : undefined,
                serviceCharge: refundData.serviceCharge
                    ? Number(refundData.serviceCharge)
                    : undefined,
                refundFromAirline: refundData.refundFromAirline
                    ? Number(refundData.refundFromAirline)
                    : undefined,
                refundAmount: refundData.refundAmount
                    ? Number(refundData.refundAmount)
                    : undefined,
                isRefunded: refundData.isRefunded,
            },
        });
    }

    // Mark sale as not refunded
    async markAsNotRefunded(id, isRefunded) {
        const sale = await prisma.sale.findUnique({
            where: { id },
        });

        if (!sale) return null;

        return prisma.sale.update({
            where: { id },
            data: { isRefunded },
        });
    }

    // Delete sale
    async deleteSale(id, user) {
        const { role, email, officeId } = user;

        const where = { id };
        if (role === ROLES.SALES) where.createdBy = email;
        if (role === ROLES.ADMIN) where.officeId = officeId;

        const existingSale = await prisma.sale.findFirst({ where });
        if (!existingSale) return null;

        await prisma.sale.delete({ where: { id } });
        return true;
    }

    // Helper: Validate sale data
    _validateSaleData(data, isUpdate = false) {
        if (!isUpdate) {
            if (!data.date) throw new Error("Date is required");
            if (!data.documentNumber)
                throw new Error("Document number is required");
        }

        if (
            data.accountType &&
            !Object.values(ACCOUNT_TYPES).includes(data.accountType)
        )
            throw new Error("Invalid account type");

        if (data.mode && !Object.values(MODES).includes(data.mode))
            throw new Error("Invalid mode");

        if (
            data.postStatus &&
            !Object.values(POST_STATUS).includes(data.postStatus)
        )
            throw new Error("Invalid post status");

        if (
            data.paymentStatus &&
            !Object.values(PAYMENT_STATUS).includes(data.paymentStatus)
        )
            throw new Error("Invalid payment status");

        if (
            data.sellPrice !== undefined &&
            (isNaN(data.sellPrice) || data.sellPrice < 0)
        )
            throw new Error("Invalid sell price");

        if (
            data.buyingPrice !== undefined &&
            (isNaN(data.buyingPrice) || data.buyingPrice < 0)
        )
            throw new Error("Invalid buying price");
    }

    // Calculate profit for a sale
    async calculateProfit(id) {
        const sale = await prisma.sale.findUnique({
            where: { id },
            select: { sellPrice: true, buyingPrice: true },
        });

        if (!sale) return null;

        return {
            profit: sale.sellPrice - sale.buyingPrice,
            margin: ((sale.sellPrice - sale.buyingPrice) / sale.sellPrice) * 100,
        };
    }

    // Get sales statistics
    async getSalesStatistics(user, startDate, endDate) {
        const { role, email, officeId } = user;

        let where = {};

        if (role === ROLES.SALES) where.createdBy = email;
        if (role === ROLES.ADMIN) where.officeId = officeId;

        if (startDate || endDate) {
            where.date = {};
            if (startDate) where.date.gte = new Date(startDate);
            if (endDate) where.date.lte = new Date(endDate);
        }

        const [total, posted, paid, totalRevenue] = await Promise.all([
            prisma.sale.count({ where }),
            prisma.sale.count({
                where: { ...where, postStatus: POST_STATUS.POSTED },
            }),
            prisma.sale.count({
                where: { ...where, paymentStatus: PAYMENT_STATUS.PAID },
            }),
            prisma.sale.aggregate({
                where,
                _sum: { sellPrice: true, buyingPrice: true },
            }),
        ]);

        return {
            total,
            posted,
            paid,
            totalSellPrice: totalRevenue._sum.sellPrice || 0,
            totalBuyingPrice: totalRevenue._sum.buyingPrice || 0,
            totalProfit:
                (totalRevenue._sum.sellPrice || 0) -
                (totalRevenue._sum.buyingPrice || 0),
        };
    }
}

const salesServices = new SalesServices();
export default salesServices;

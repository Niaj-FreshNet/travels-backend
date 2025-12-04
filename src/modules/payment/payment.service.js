import prisma from "../../config/db.js";
import paginate from "../../utils/paginate.js";
import { ROLES, PAYMENT_METHODS } from "./payment.constant.js";

class PaymentServices {
    // Get all payments (Admin sees office payments, Super-Admin sees all)
    async getAllPayments({ user, query }) {
        const { role, officeId } = user;

        let where = {};

        // Admin = only their office
        if (role === ROLES.ADMIN) {
            where.officeId = officeId;
        }

        // Optional filters
        if (query.supplierName) where.supplierName = query.supplierName;
        if (query.method) where.method = query.method;

        // Date range filter using JS Date objects
        if (query.startDate || query.endDate) {
            where.createdAt = {};
            if (query.startDate) where.createdAt.gte = new Date(query.startDate);
            if (query.endDate) where.createdAt.lte = new Date(query.endDate);
        }

        return paginate(prisma.payment, where, {
            page: query.page ? parseInt(query.page) : 1,
            limit: query.limit ? parseInt(query.limit) : 25,
            sort: query.sort || "-createdAt",
            search: query.search,
            searchFields: ["method", "createdBy", "officeId"],
        });
    }

    // Get single payment by ID
    async getPaymentById(id, user) {
        const { role, officeId } = user;

        const where = { id };

        // Admins can only see payments from their office
        if (role === ROLES.ADMIN) {
            where.officeId = officeId;
        }
        // Super-Admin can see any payment

        return prisma.payment.findFirst({ where });
    }

    // Create new payment
    async createPayment(data, user) {
        // Validate required fields
        this._validatePaymentData(data);

        const paymentData = {
            ...data,
            paidAmount: Number(data.paidAmount) || 0,
            createdBy: user.email,
            officeId: user.officeId,
            createdAt: new Date(),
        };

        return prisma.payment.create({ data: paymentData });
    }

    // Update payment
    async updatePayment(id, data, user) {
        const { role, officeId } = user;

        const where = { id };

        // Admins can only update payments from their office
        if (role === ROLES.ADMIN) {
            where.officeId = officeId;
        }

        const existingPayment = await prisma.payment.findFirst({ where });
        if (!existingPayment) return null;

        // Validate update data
        this._validatePaymentData(data, true);

        // Remove fields that shouldn't be updated
        const { createdBy, officeId: _office, createdAt, ...updateData } = data;

        // Convert paidAmount to number if present
        if (updateData.paidAmount !== undefined) {
            updateData.paidAmount = Number(updateData.paidAmount);
        }

        return prisma.payment.update({
            where: { id },
            data: updateData,
        });
    }

    // Delete payment
    async deletePayment(id, user) {
        const { role, officeId } = user;

        const where = { id };

        // Admins can only delete payments from their office
        if (role === ROLES.ADMIN) {
            where.officeId = officeId;
        }

        const existingPayment = await prisma.payment.findFirst({ where });
        if (!existingPayment) return null;

        await prisma.payment.delete({ where: { id } });
        return true;
    }

    // Helper: Validate payment data
    _validatePaymentData(data, isUpdate = false) {
        if (!isUpdate) {
            if (!data.paidAmount) throw new Error("paidAmount is required");
            if (!data.paymentDate) throw new Error("paymentDate is required");
        }

        // Validate paidAmount is a valid number
        if (data.paidAmount !== undefined) {
            const paidAmount = Number(data.paidAmount);
            if (isNaN(paidAmount) || paidAmount < 0) {
                throw new Error("Invalid paidAmount");
            }
        }

        // Validate payment method if provided
        if (
            data.method &&
            !Object.values(PAYMENT_METHODS).includes(data.method)
        ) {
            throw new Error("Invalid payment method");
        }
    }

    // Get payment statistics
    async getPaymentStatistics(user, startDate, endDate) {
        const { role, officeId } = user;

        let where = {};

        // Admins see only their office stats
        if (role === ROLES.ADMIN) {
            where.officeId = officeId;
        }

        if (query.startDate || query.endDate) {
            where.paymentDate = {};
            if (query.startDate) where.paymentDate.gte = new Date(query.startDate);
            if (query.endDate) where.paymentDate.lte = new Date(query.endDate);
        }

        const [total, totalAmount] = await Promise.all([
            prisma.payment.count({ where }),
            prisma.payment.aggregate({
                where,
                _sum: { paidAmount: true },
            }),
        ]);

        return {
            total,
            totalAmount: totalAmount._sum.paidAmount || 0,
        };
    }
}

const paymentServices = new PaymentServices();
export default paymentServices;

import prisma from "../../config/db.js";
import paginate from "../../utils/paginate.js";
import { ROLES, PAYMENT_METHODS } from "./payment.constant.js";

class PaymentServices {
    // Get all payments (Admin sees office payments, Super-Admin sees all)
    async getAllPayments({ user, query }) {
        const { role, email, officeId } = user;

        let where = {};

        // Admins see only their office payments
        if (role === ROLES.ADMIN) {
            where.officeId = officeId;
        }
        // Super-Admin sees all payments (no filter)
        // Sales users are blocked at controller level

        // Optional filters
        if (query.method) {
            where.method = query.method;
        }

        // Date filters
        if (query.startDate || query.endDate) {
            where.date = {};
            if (query.startDate) where.date.gte = query.startDate;
            if (query.endDate) where.date.lte = query.endDate;
        }

        return paginate(prisma.payment, where, {
            page: query.page,
            limit: query.limit || 25,
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
            amount: Number(data.amount) || 0,
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

        // Convert amount to number if present
        if (updateData.amount !== undefined) {
            updateData.amount = Number(updateData.amount);
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
            if (!data.amount) throw new Error("Amount is required");
            if (!data.date) throw new Error("Date is required");
        }

        // Validate amount is a valid number
        if (data.amount !== undefined) {
            const amount = Number(data.amount);
            if (isNaN(amount) || amount < 0) {
                throw new Error("Invalid amount");
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

        if (startDate || endDate) {
            where.date = {};
            if (startDate) where.date.gte = startDate;
            if (endDate) where.date.lte = endDate;
        }

        const [total, totalAmount] = await Promise.all([
            prisma.payment.count({ where }),
            prisma.payment.aggregate({
                where,
                _sum: { amount: true },
            }),
        ]);

        return {
            total,
            totalAmount: totalAmount._sum.amount || 0,
        };
    }
}

const paymentServices = new PaymentServices();
export default paymentServices;

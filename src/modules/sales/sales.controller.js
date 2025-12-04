import salesServices from "./sales.service.js";
import { HTTP_STATUS, MESSAGES } from "./sales.constant.js";

class SalesController {
    // GET /api/sales - Get all sales
    async getSales(req, res) {
        try {
            const result = await salesServices.getAllSales({
                user: req.user,
                query: req.query,
            });

            res.status(HTTP_STATUS.OK).json({
                success: true,
                data: result,
            });
        } catch (err) {
            console.error("Error fetching sales:", err);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: err.message || MESSAGES.ERROR.FETCH_FAILED,
            });
        }
    }

    async getRefundSales(req, res) {
        try {
            const result = await salesServices.getRefundSales({
                user: req.user,
                query: req.query,
            });

            return res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            console.error("Error in refund sales:", error);

            return res.status(500).json({
                success: false,
                message: "Failed to get refund sales",
                error: error.message
            });
        }
    }

    // GET /api/sales/:id - Get single sale by ID
    async getSaleById(req, res) {
        try {
            const { id } = req.params;
            const sale = await salesServices.getSaleById(id, req.user);

            if (!sale) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({
                    success: false,
                    error: MESSAGES.ERROR.NOT_FOUND,
                });
            }

            res.status(HTTP_STATUS.OK).json({
                success: true,
                data: sale,
            });
        } catch (err) {
            console.error("Error fetching sale:", err);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: err.message || MESSAGES.ERROR.FETCH_FAILED,
            });
        }
    }

    // GET /api/sales/payment-status - Get sales by supplier and payment status
    async getSalesBySupplierPaymentStatus(req, res) {
        try {
            const { supplierName } = req.query;

            if (!supplierName) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    error: "Supplier name is required",
                });
            }

            // Pass user and full query for pagination and filters
            const sales = await salesServices.getSalesBySupplierPaymentStatus({
                user: req.user,
                query: req.query,
            });

            if (!sales || sales.data.length === 0) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({
                    success: false,
                    error: "No results found for the supplier",
                });
            }

            res.status(HTTP_STATUS.OK).json({
                success: true,
                data: sales,
            });
        } catch (err) {
            console.error("Error fetching sales by supplier:", err);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: err.message || MESSAGES.ERROR.FETCH_FAILED,
            });
        }
    }

    async getPaymentCounts(req, res) {
        try {
            const result = await salesServices.getPaymentCounts();
            return res.status(200).json({ success: true, data: result });
        } catch (error) {
            console.error("Error fetching payment counts:", error);
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    async getProfitSummary(req, res) {
        try {
            const result = await salesServices.calculateProfitSummary();

            return res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            console.error("Error in profit summary:", error);

            return res.status(500).json({
                success: false,
                message: "Failed to calculate profit summary",
                error: error.message
            });
        }
    }

    async getTotalDuePerUser(req, res) {
        try {
            const result = await salesServices.calculateTotalDuePerUser();
            return res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error) {
            console.error("Error fetching total due per user:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    }

    // GET /api/sales/validate-existing - Validate document number & get next RV number
    async validateExistingSale(req, res) {
        try {
            const { documentNumber } = req.query;

            if (!documentNumber) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    error: "Document number is required",
                });
            }

            const result = await salesServices.validateDocumentAndGenerateRV(
                documentNumber
            );

            res.status(HTTP_STATUS.OK).json({
                success: true,
                ...result,
            });
        } catch (err) {
            console.error("Error validating document number:", err);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: "Error validating document number",
            });
        }
    }

    // POST /api/sales - Create new sale
    async createSale(req, res) {
        try {
            const sale = await salesServices.createSale(req.body, req.user);

            res.status(HTTP_STATUS.CREATED).json({
                success: true,
                message: MESSAGES.SUCCESS.CREATED,
                data: sale,
            });
        } catch (err) {
            console.error("Error creating sale:", err);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: err.message || MESSAGES.ERROR.CREATE_FAILED,
            });
        }
    }

    // PUT /api/sales/:id - Update entire sale
    async updateSale(req, res) {
        try {
            const { id } = req.params;
            const sale = await salesServices.updateSale(id, req.body, req.user);

            if (!sale) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({
                    success: false,
                    error: MESSAGES.ERROR.NOT_FOUND,
                });
            }

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: MESSAGES.SUCCESS.UPDATED,
                data: sale,
            });
        } catch (err) {
            console.error("Error updating sale:", err);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: err.message || MESSAGES.ERROR.UPDATE_FAILED,
            });
        }
    }

    // PATCH /api/sales/:id - Partial update of sale
    async partialUpdateSale(req, res) {
        try {
            const { id } = req.params;
            const sale = await salesServices.partialUpdateSale(
                id,
                req.body,
                req.user
            );

            if (!sale) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({
                    success: false,
                    error: MESSAGES.ERROR.NOT_FOUND,
                });
            }

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: MESSAGES.SUCCESS.UPDATED,
                data: sale,
            });
        } catch (err) {
            console.error("Error partially updating sale:", err);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: err.message || MESSAGES.ERROR.UPDATE_FAILED,
            });
        }
    }

    // PATCH /api/sales/:id/postStatus - Update post status
    async updatePostStatus(req, res) {
        try {
            const { id } = req.params;
            const { postStatus } = req.body;

            if (!postStatus) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    error: "Post status is required",
                });
            }

            const sale = await salesServices.updatePostStatus(id, postStatus);

            if (!sale) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({
                    success: false,
                    error: MESSAGES.ERROR.NOT_FOUND,
                });
            }

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: "Post status updated successfully",
                data: sale,
            });
        } catch (err) {
            console.error("Error updating post status:", err);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: "Failed to update post status",
            });
        }
    }

    // PATCH /api/sales/:id/refundStatus - Update refund status
    async updateRefundStatus(req, res) {
        try {
            const { id } = req.params;
            const { postStatus } = req.body;

            if (!postStatus) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    error: "Refund status is required",
                });
            }

            const sale = await salesServices.updatePostStatus(id, postStatus);

            if (!sale) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({
                    success: false,
                    error: MESSAGES.ERROR.NOT_FOUND,
                });
            }

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: "Refund status updated successfully",
                data: sale,
            });
        } catch (err) {
            console.error("Error updating refund status:", err);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: "Failed to update refund status",
            });
        }
    }

    // PATCH /api/sales/:id/paymentStatus - Update payment status
    async updatePaymentStatus(req, res) {
        try {
            const { id } = req.params;
            const { paymentStatus } = req.body;

            if (!paymentStatus) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    error: "Payment status is required",
                });
            }

            const sale = await salesServices.updatePaymentStatus(id, paymentStatus);

            if (!sale) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({
                    success: false,
                    error: MESSAGES.ERROR.NOT_FOUND,
                });
            }

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: "Payment status updated successfully",
                data: sale,
            });
        } catch (err) {
            console.error("Error updating payment status:", err);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: "Failed to update payment status",
            });
        }
    }

    // PATCH /api/sales/:id/isRefund - Mark sale as refunded
    async markAsRefunded(req, res) {
        try {
            const { id } = req.params;
            const {
                refundCharge,
                serviceCharge,
                refundFromAirline,
                refundAmount,
                isRefunded,
                refundDate,
            } = req.body;

            const sale = await salesServices.markAsRefunded(id, {
                refundDate,
                refundCharge,
                serviceCharge,
                refundFromAirline,
                refundAmount,
                isRefunded,
            });

            if (!sale) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({
                    success: false,
                    error: MESSAGES.ERROR.NOT_FOUND,
                });
            }

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: "Sale marked as refunded successfully",
                data: sale,
            });
        } catch (err) {
            console.error("Error marking sale as refunded:", err);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: "Failed to mark sale as refunded",
            });
        }
    }

    // PATCH /api/sales/:id/notRefund - Mark sale as not refunded
    async markAsNotRefunded(req, res) {
        try {
            const { id } = req.params;
            const { isRefunded } = req.body;

            const sale = await salesServices.markAsNotRefunded(id, isRefunded);

            if (!sale) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({
                    success: false,
                    error: MESSAGES.ERROR.NOT_FOUND,
                });
            }

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: "Sale marked as not refunded successfully",
                data: sale,
            });
        } catch (err) {
            console.error("Error marking sale as not refunded:", err);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: "Failed to mark sale as not refunded",
            });
        }
    }

    // DELETE /api/sales/:id - Delete sale
    async deleteSale(req, res) {
        try {
            const { id } = req.params;
            const deleted = await salesServices.deleteSale(id, req.user);

            if (!deleted) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({
                    success: false,
                    error: MESSAGES.ERROR.NOT_FOUND,
                });
            }

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: MESSAGES.SUCCESS.DELETED,
            });
        } catch (err) {
            console.error("Error deleting sale:", err);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: err.message || MESSAGES.ERROR.DELETE_FAILED,
            });
        }
    }
}

export const salesController = new SalesController();

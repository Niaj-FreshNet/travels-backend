import express from "express";
import { salesController } from "./sales.controller.js";
import verifyToken from "../../middleware/auth.middleware.js";
import verifyAdmin from "../../middleware/admin.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// ============ Main CRUD Operations ============

// GET /api/sales - Get all sales with pagination & filters
router.get("/", salesController.getSales);

// POST /api/sales - Create a new sale
router.post("/", salesController.createSale);

// GET /api/sales/validate-existing - Validate document number & get next RV number
router.get("/validate-existing-sales", salesController.validateExistingSale);

// GET /api/sales/payment-status - Get sales by supplier and payment status
router.get("/payment-status", salesController.getSalesBySupplierPaymentStatus);

router.get("/payment-status-count", salesController.getPaymentCounts);

router.get("/profit-summary", salesController.getProfitSummary);

// Get total due for all users
router.get("/total-due", verifyAdmin, salesController.getTotalDuePerUser);

// GET /api/sales/:id - Get single sale by ID
router.get("/:id", salesController.getSaleById);

// PUT /api/sales/:id - Update entire sale
router.put("/:id", salesController.updateSale);

// DELETE /api/sales/:id - Delete sale by ID
router.delete("/:id", salesController.deleteSale);

// ============ Status Update Operations ============

// PATCH /api/sales/:id/postStatus - Update post status
router.patch("/:id/postStatus", salesController.updatePostStatus);

// PATCH /api/sales/:id/refundStatus - Update refund status
router.patch("/:id/refundStatus", salesController.updateRefundStatus);

// PATCH /api/sales/:id/paymentStatus - Update payment status
router.patch("/:id/paymentStatus", salesController.updatePaymentStatus);

// ============ Refund Operations ============

// PATCH /api/sales/:id/isRefund - Mark sale as refunded
router.patch("/:id/isRefund", salesController.markAsRefunded);

// PATCH /api/sales/:id/notRefund - Mark sale as not refunded
router.patch("/:id/notRefund", salesController.markAsNotRefunded);

// ============ Partial Update ============

// PATCH /api/sales/:id - Partial update of sale fields
router.patch("/:id", salesController.partialUpdateSale);

export const salesRoutes = router;

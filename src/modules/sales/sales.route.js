import express from "express";
import { salesController } from "./sales.controller.js";
import verifyToken from "../../middleware/auth.middleware.js";
import verifyAdmin from "../../middleware/admin.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// ============ STATIC ROUTES (PLACE FIRST) ============

// GET /api/sales - Get all sales with pagination & filters
router.get("/", salesController.getSales);

// POST /api/sales - Create a new sale
router.post("/", salesController.createSale);

// Validate existing
router.get("/validate-existing-sales", salesController.validateExistingSale);

// Payment status routes
router.get("/payment-status", salesController.getSalesBySupplierPaymentStatus);
router.get("/payment-status-count", salesController.getPaymentCounts);

// Refund sales list
router.get("/refunds", salesController.getRefundSales);

// Profit summary
router.get("/profit-summary", salesController.getProfitSummary);

// Admin-only due total
router.get("/total-due", verifyAdmin, salesController.getTotalDuePerUser);

// ============ DYNAMIC ROUTES (ALWAYS LAST) ============

// Status update operations
router.patch("/:id/postStatus", salesController.updatePostStatus);
router.patch("/:id/refundStatus", salesController.updateRefundStatus);
router.patch("/:id/paymentStatus", salesController.updatePaymentStatus);

// Refund operations
router.patch("/:id/isRefund", salesController.markAsRefunded);
router.patch("/:id/notRefund", salesController.markAsNotRefunded);

// Partial update
router.patch("/:id", salesController.partialUpdateSale);

// GET single sale
router.get("/:id", salesController.getSaleById);

// DELETE
router.delete("/:id", salesController.deleteSale);

export const salesRoutes = router;

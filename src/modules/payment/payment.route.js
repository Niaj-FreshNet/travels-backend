import express from "express";
import { paymentController } from "./payment.controller.js";
import verifyToken from "../../middleware/auth.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// ============ Payment CRUD Operations ============

// GET /api/payments - Get all payments (Admin/Super-Admin only)
router.get("/", paymentController.getPayments);

// GET /api/payments/:id - Get single payment by ID
router.get("/:id", paymentController.getPaymentById);

// POST /api/payments - Create new payment (Admin/Super-Admin only)
router.post("/", paymentController.createPayment);

// PUT /api/payments/:id - Update payment
router.put("/:id", paymentController.updatePayment);

// DELETE /api/payments/:id - Delete payment
router.delete("/:id", paymentController.deletePayment);

export const paymentRoutes = router;

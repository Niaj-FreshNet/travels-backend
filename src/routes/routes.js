import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.route.js";
import { userRoutes } from "../modules/user/user.route.js";
import { salesRoutes } from '../modules/sales/sales.route.js';
import { paymentRoutes } from "../modules/payment/payment.route.js";
import { airlineRoutes } from "../modules/airlines/airlines.route.js";
import { supplierRoutes } from "../modules/supplier/supplier.route.js";
import { clientAreaRoutes } from "../modules/clientArea/clientArea.route.js";

const router = Router();

// Mount routes
router.use("/auth", authRoutes);      // Auth routes (login, token)
router.use("/users", userRoutes);     // User management routes
router.use("/sales", salesRoutes);    // Sales routes
router.use("/payment", paymentRoutes);  // Payment routes
router.use("/airlines", airlineRoutes)
router.use("/suppliers", supplierRoutes)
router.use("/clientArea", clientAreaRoutes);

// Health check for API
router.get("/health", (req, res) => {
    res.json({
        success: true,
        message: "API is running",
        timestamp: new Date().toISOString(),
    });
});

export default router;
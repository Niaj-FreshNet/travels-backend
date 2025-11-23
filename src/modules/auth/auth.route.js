import { Router } from "express";
import verifyToken from "../../middleware/auth.middleware.js";
import authController from "./auth.controller.js";

const router = Router();

// POST /api/auth/login - Generate JWT token
router.post("/login", authController.login);

// POST /api/auth/refresh - Refresh JWT token (optional)
router.post("/refresh", authController.refreshToken);

// GET /api/auth/verify - Verify if token is valid
router.get("/verify", verifyToken, authController.verifyToken);

// POST /api/auth/logout - Logout (optional, for token blacklisting)
router.post("/logout", verifyToken, authController.logout);

export const authRoutes = router;
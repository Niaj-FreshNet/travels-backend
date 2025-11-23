import { Router } from "express";
import verifyToken from "../../middleware/auth.middleware.js";
import verifyAdmin from "../../middleware/admin.middleware.js";
import verifySuperAdmin from "../../middleware/superAdmin.middleware.js";
import userController from "./user.controller.js";

const router = Router();

// All routes require authentication
router.use(verifyToken);

// ============ User Status & Role Checking ============

// GET /api/users/status/:email - Check if user account is active
router.get("/status/:email", userController.getUserStatus);

// GET /api/users/admin/:email - Check if user is admin
router.get("/admin/:email", userController.checkIsAdmin);

// GET /api/users/super-admin/:email - Check if user is super-admin
router.get("/super-admin/:email", userController.checkIsSuperAdmin);

// ============ User Management ============

// GET /api/users - Get current logged-in user info
router.get("/", userController.getCurrentUser);

// GET /api/users/all - Get all users (Super-Admin only)
router.get("/all", verifySuperAdmin, userController.getAllUsers);

// GET /api/users/office - Get users in admin's office (Admin only)
router.get("/office", verifyAdmin, userController.getOfficeUsers);

// GET /api/users/:id - Get single user by ID
router.get("/:id", userController.getUserById);

// POST /api/users - Create new user (Admin/Super-Admin)
router.post("/", userController.createUser);

// PUT /api/users/:id - Update user
router.put("/:id", userController.updateUser);

// PATCH /api/users/:id/status - Update user status
router.patch("/:id/status", userController.updateUserStatus);

// DELETE /api/users/:id - Delete user
router.delete("/:id", userController.deleteUser);

export const userRoutes = router;

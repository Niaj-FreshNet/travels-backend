import express from "express";
import { supplierController } from "./supplier.controller.js";
import verifyToken from "../../middleware/auth.middleware.js";

const router = express.Router();
router.use(verifyToken);

router.get("/", supplierController.getSuppliers);
router.get("/:id", supplierController.getSupplierById);
router.post("/", supplierController.createSupplier);
router.put("/:id", supplierController.updateSupplier);
router.put("/:id/status", supplierController.updateSupplierStatus);
router.delete("/:id", supplierController.deleteSupplier);

// Special route: Update totalDue by supplierName
router.patch("/due/:supplierName", supplierController.updateSupplierTotalDue);

export const supplierRoutes = router;
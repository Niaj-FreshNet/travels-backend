import express from "express";
import { clientAreaController } from "./clientArea.controller.js";
import verifyToken from "../../middleware/auth.middleware.js";
import verifySuperAdmin from "../../middleware/superAdmin.middleware.js";

const router = express.Router();

// Only Super-Admin can manage client areas (offices)
router.use(verifyToken, verifySuperAdmin);

router.post("/", clientAreaController.createClientArea);
router.get("/", clientAreaController.getAllClientAreas);
router.delete("/:id", clientAreaController.deleteClientArea);

export const clientAreaRoutes = router;
import express from "express";
import { airlineController } from "./airlines.controller.js";
import verifyToken from "../../middleware/auth.middleware.js";

const router = express.Router();

// Public: Airlines are global (no office restriction)
router.get("/", airlineController.getAirlines);
router.get("/:id", airlineController.getAirlineById);

// Protected: Only Admin & Super-Admin can modify
router.use(verifyToken);
router.post("/", airlineController.createAirline);
router.put("/:id", airlineController.updateAirline);
router.put("/:id/status", airlineController.updateAirlineStatus);
router.delete("/:id", airlineController.deleteAirline);

export const airlineRoutes = router;
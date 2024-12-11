import express from "express";
import { measureDimensions } from "../controllers/imageController.js";

const router = express.Router();
router.post('/measure', measureDimensions);

export default router;

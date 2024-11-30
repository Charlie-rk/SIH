import express from "express";
import { createNewParcel } from "../controllers/parcelController.js";

const router = express.Router();
router.post('/createNewParcel', createNewParcel);

export default router;

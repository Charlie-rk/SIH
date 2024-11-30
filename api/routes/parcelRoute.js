import express from "express";
import { createNewParcel, trackParcel } from "../controllers/parcelController.js";

const router = express.Router();
router.post('/createNewParcel', createNewParcel);
router.get('/trackParcel/:parcelId', trackParcel);

export default router;

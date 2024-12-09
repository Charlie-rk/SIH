import express from "express";
import { createNewParcel, trackParcel, dispatchParcel, acceptParcel } from "../controllers/parcelController.js";

const router = express.Router();
router.post('/createNewParcel', createNewParcel);
router.post('/trackParcel', trackParcel);
router.post('/dispatchParcel', dispatchParcel);
router.post('/acceptParcel', acceptParcel);

export default router;

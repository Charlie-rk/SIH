import express from "express";

import { acceptParcel, createNewParcel, dispatchParcel, trackParcel } from "../controllers/parcelController.js";


const router = express.Router();
router.post('/createNewParcel', createNewParcel);
router.post('/trackParcel', trackParcel);

router.post('/acceptParcel', acceptParcel);
router.post('/dispatchParcel', dispatchParcel);


export default router;

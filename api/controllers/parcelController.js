import { v4 as uuidv4 } from 'uuid';
import Parcel from '../models/parcelModel.js';

/**
 * Create a new parcel
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
export const createNewParcel = async (req, res) => {
    // console.log(req.body);
  try {
    const {
      sender,
      receiver,
      currentStatus,
      deliveryType,
      deadline,
      dimensions,
      weight,
      predictedDeliveryTime,
      history,
    } = req.body;

    // console.log(sender);
    // console.log(receiver);
    // console.log(currentStatus);
    // console.log(deliveryType);
    // console.log(weight);
    if (
      !sender ||
      !receiver ||
      !currentStatus ||
      !deliveryType ||
      !weight
    ) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Generate a unique parcelId
    const parcelId = `PARCEL-${uuidv4()}`;
    // console.log(parcelId);

    // Get dimensions from images
    if (!dimensions) {
      dimensions = await getParcelDimension(req.files);
    }

    // Create a new parcel
    const newParcel = new Parcel({
      parcelId,
      sender,
      receiver,
      currentStatus,
      deliveryType,
      deadline,
      weight,
      dimensions,
      predictedDeliveryTime,
      history,
    });

    const savedParcel = await newParcel.save();

    return res.status(201).json({
      message: "Parcel created successfully.",
      parcel: savedParcel,
    });
  } catch (error) {
    console.error("Error creating parcel:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

/**
 * Get dimensions of a parcel from provided images
 * @param {Array} images - Array of image files from the request
 * @returns {Object} Dimensions of the parcel
 */
export const getParcelDimension = async (images) => {
  try {
    // Validate the number of images
    if (!images || images.length !== 4) {
      throw new Error("Four images (front, side, back, top) are required.");
    }

    // Simulate interaction with the ML model
    console.log("Getting Image from ML model...");

    // Simulated default dimensions (length, width, height in cm)
    const defaultDimensions = { length: 30, width: 20, height: 15 };

    // Log for debugging purposes
    console.log("Received images:", images.map((img) => img.originalname));

    return defaultDimensions;
  } catch (error) {
    console.error("Error getting parcel dimensions:", error);
    throw new Error("Failed to process images.");
  }
};



/**
 * Track a parcel by its ID
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
export const trackParcel = async (req, res) => {
    const { parcelId } = req.params;
  
    try {
      if (!parcelId) {
        return res.status(400).json({ message: 'Parcel ID is required.' });
      }
  
      const parcel = await Parcel.findOne({ parcelId });
  
      if (!parcel) {
        return res.status(404).json({ message: 'Parcel not found.' });
      }
  
      return res.status(200).json({
        message: 'Parcel tracked successfully.',
        currentStatus: parcel.currentStatus,
        history: parcel.history,
      });
    } catch (error) {
      console.error('Error tracking parcel:', error);
      return res.status(500).json({ message: 'Server error.' });
    }
  };

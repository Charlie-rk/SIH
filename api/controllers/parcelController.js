const { v4: uuidv4 } = require("uuid"); // Import UUID for unique ID generation
const Parcel = require("../models/parcelModel");

/**
 * Create a new parcel
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
export const createNewParcel = async (req, res) => {
  try {
    // Extract parcel data from request body
    const {
      sender,
      receiver,
      currentStatus,
      currentNode,
      destinationNode,
      deliveryType,
      deadline,
      weight,
      dimensions,
      predictedDeliveryTime,
      history,
    } = req.body;

    // Validate required fields
    if (
      !sender ||
      !receiver ||
      !currentStatus ||
      !deliveryType ||
      !weight ||
      !dimensions ||
      !dimensions.length ||
      !dimensions.width ||
      !dimensions.height
    ) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Generate a unique parcelId
    const parcelId = `PARCEL-${uuidv4()}`;

    // Create a new parcel
    const newParcel = new Parcel({
      parcelId,
      sender,
      receiver,
      currentStatus,
      currentNode,
      destinationNode,
      deliveryType,
      deadline,
      weight,
      dimensions,
      predictedDeliveryTime,
      history,
    });

    // Save to database
    const savedParcel = await newParcel.save();

    // Respond with the saved parcel
    return res.status(201).json({
      message: "Parcel created successfully.",
      parcel: savedParcel,
    });
  } catch (error) {
    console.error("Error creating parcel:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

// Additional functions can be defined similarly as named exports
// Example:
/**
 * Get all parcels
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
export const getAllParcels = async (req, res) => {
  try {
    const parcels = await Parcel.find();
    res.status(200).json(parcels);
  } catch (error) {
    console.error("Error fetching parcels:", error);
    res.status(500).json({ message: "Server error." });
  }
};

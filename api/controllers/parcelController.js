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

/**
 * Generate a placeholder route for parcel delivery.
 * @param {String} sourceNode - The starting node
 * @param {String} destNode - The destination node
 * @param {String} parcelId - The parcel ID
 * @param {String} condition - Delivery condition (e.g., "cheapest", "deadline-based")
 * @returns {Object} - Placeholder route details including nodes, timings, transport modes, total time, and distance
 */
export const generateParcelRoute = async (sourceNode, destNode, parcelId, condition) => {
  try {
    // Placeholder response
    const placeholderRoute = [
      {
        node: "A",
        arrivalTime: "2:35 PM",
        dispatchTime: "2:45 PM",
        arrivalMode: {
          type: "Flight",
          identifier: "F1"
        }
      },
      {
        node: "B",
        arrivalTime: "3:15 PM",
        dispatchTime: "3:25 PM",
        arrivalMode: {
          type: "Truck",
          identifier: "Tr2"
        }
      },
      {
        node: "C",
        arrivalTime: "4:00 PM",
        dispatchTime: "4:10 PM",
        arrivalMode: {
          type: "Train",
          identifier: "T1"
        }
      },
      {
        node: "D",
        arrivalTime: "5:00 PM",
        dispatchTime: "5:10 PM",
        arrivalMode: {
          type: "Truck",
          identifier: "Tr3"
        }
      },
      {
        node: "E",
        arrivalTime: "6:00 PM",
        dispatchTime: "6:15 PM",
        arrivalMode: {
          type: "Flight",
          identifier: "F2"
        }
      },
      {
        node: "F",
        arrivalTime: "7:10 PM",
        dispatchTime: "7:20 PM",
        arrivalMode: {
          type: "Train",
          identifier: "T2"
        }
      }
    ];

    const totalTime = "4 hours 35 minutes";
    const totalDistance = "450 km";

    // Return the same response for now
    return {
      route: placeholderRoute,
      totalTime,
      totalDistance
    };
  } catch (error) {
    console.error("Error generating parcel route:", error);
    return { message: "Server error." };
  }
};

/**
 * Accept a parcel and update its history
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
export const acceptParcel = async (req, res) => {
  const { parcelId, nodeName } = req.body;

  try {
    // Find the parcel by its ID
    const parcel = await Parcel.findOne({ parcelId });

    if (!parcel) {
      return res.status(404).json({ message: 'Parcel not found.' });
    }

    // Get the current date and time
    const currentDate = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
    const currentTime = new Date().toTimeString().split(" ")[0]; // Format: HH:MM:SS

    // Update the parcel's history
    parcel.history.forEach(event => {
      if (event.location === nodeName) {

        event.date = currentDate;
        event.time = currentTime;
        event.location = nodeName;
        event.status = "In Transit";
        event.LockStatus = true;
      }
    });

    // Save the updated parcel
    await parcel.save();

    return res.status(200).json({
      message: 'Parcel accepted and history updated successfully.',
      parcel,
    });
  } catch (error) {
    console.error('Error accepting parcel:', error);
    return res.status(500).json({ message: 'Server error.' });
  }
};




/**
 * Dispatch a parcel and update its history
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
export const dispatchParcel = async (req, res) => {
  const { parcelId, nodeName } = req.body;

  try {
    // Find the parcel by its ID
    const parcel = await Parcel.findOne({ parcelId });

    if (!parcel) {
      return res.status(404).json({ message: "Parcel not found" });
    }

    // Filter the history to remove events based on conditions
    parcel.history = parcel.history.filter(event => {
      return !(event.location === nodeName || event.LockStatus === false);
    });

    // Generate predicted route based on the parcel details
    const predictedRoute = await generateParcelRoute(nodeName, parcel.destNode, parcelId, parcel.condition);

    // Add the predicted route to the parcel's history
    predictedRoute.route.forEach(node => {
      parcel.history.push({
        date: new Date().toISOString().split("T")[0], // Using current date for arrival
        time: node.arrivalTime,
        location: node.node,
        status: "Pending",
        LockStatus: false, // Initial lock status
      });
    });

    // Update status to "Dispatched" for the current node
    parcel.history.forEach(node => {
      if (node.location === nodeName) {
        node.status = "Dispatched";
      }
    });

    // Save the updated parcel document
    await parcel.save();

    return res.status(200).json({ message: "Parcel history updated successfully" });

  } catch (error) {
    console.error("Error dispatching parcel:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
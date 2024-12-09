import { v4 as uuidv4 } from 'uuid';
import Parcel from '../models/parcelModel.js';
import Node from '../models/NodeModel.js';
import { changeParcelNotificationStatus, sendParcelNotification } from './parcelNotificationController.js';
import { findMinCost } from './mincost.js';

/**
 * Generate a unique 6-character parcel ID based on sender and receiver pin codes.
 * @param {string} senderPinCode - Sender's pin code.
 * @param {string} receiverPinCode - Receiver's pin code.
 * @returns {Promise<string>} - A unique 6-character parcel ID.
 */
const generateUniqueParcelId = async (senderPinCode, receiverPinCode) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  // Helper function to generate random 3-character suffix
  const generateSuffix = () => {
    let suffix = "";
    for (let i = 0; i < 3; i++) {
      suffix += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return suffix;
  };

  const preSender = senderPinCode.slice(0, 2);
  const preReceiver = receiverPinCode.slice(0, 2);
  const supReceiver = receiverPinCode.slice(2, 4);

  // Prefix logic based on sender and receiver pin codes
  const prefix = preSender === preReceiver
    ? `${preSender}0${supReceiver}`
    : `${preSender}1${preSender}`;

  let parcelId;
  let isUnique = false;

  // Generate unique ID
  while (!isUnique) {
    parcelId = `${prefix}${generateSuffix()}`;
    const existingParcel = await Parcel.findOne({ parcelId });
    if (!existingParcel) {
      isUnique = true;
    }
  }

  return parcelId;
};

/**
 * Create a new parcel
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
export const createNewParcel = async (req, res) => {
  console.log("Received request to create a new parcel:", req.body);

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

    // Validate required fields
    if (!sender || !receiver || !currentStatus || !deliveryType || !weight) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Validate sender and receiver pin codes
    if (
      sender.address.pinCode.length < 5 ||
      receiver.address.pinCode.length < 5
    ) {
      return res.status(400).json({
        message: "Invalid sender or receiver pin code. Pin codes must be at least 5 characters long.",
      });
    }

    // Generate a unique parcel ID
    const parcelId = await generateUniqueParcelId(
      sender.address.pinCode,
      receiver.address.pinCode
    );

    // Get dimensions from images if not provided
    let parcelDimensions = dimensions;
    if (!parcelDimensions) {
      // Assuming `getParcelDimension` is a valid function
      parcelDimensions = await getParcelDimension(req.files);
    }

    // Create a new parcel document
    const newParcel = new Parcel({
      parcelId,
      sender,
      receiver,
      currentStatus,
      deliveryType,
      deadline,
      weight,
      dimensions: parcelDimensions,
      predictedDeliveryTime,
      history,
    });

    // Add initial history entry
    newParcel.history.push({
      date: new Date().toISOString().split("T")[0], // Current date
      time: new Date().toLocaleTimeString(), // Current time
      location: sender.address.city, // Starting location
      status: "In Transit",
      LockStatus: true, // Initial lock status
    });

    // Save the parcel to the database
    const savedParcel = await newParcel.save();

    console.log("Parcel created. Sender city:", sender.address.city);
    console.log("Receiver city:", receiver.address.city);

    // Generate parcel route
    const parcelRoute = await generateParcelRoute(
      sender.address.city,
      receiver.address.city,
      parcelId,
      "cheapest"
    );
    console.log("Generated parcel route:", parcelRoute);

    // Send notification to the sender's city
    const message = `${parcelId} is ready`;
    await sendParcelNotification(parcelId, sender.address.city, message, "Accepted");

    

    console.log("Parcel created successfully");
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
 * Track a parcel by its ID
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
export const trackParcel = async (req, res) => {
  console.log("Track me ");
  const { parcelId } = req.body;
  console.log(parcelId);

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


export const generateParcelRoute = async (sourceNode, destNode, parcelId, condition) => {
  console.log("Generating routes...");
  try {
    // Use the findMinCost function to calculate the route dynamically
    console.log(sourceNode);
    const routeDetails = findMinCost(sourceNode, destNode, "07:30");

    // If no route found, return an error
    if (!routeDetails || !routeDetails.route || routeDetails.route.length === 0) {
      return { message: "No route found for the specified conditions." };
    }

    // Extract necessary details
    const totalTime = routeDetails.totalTime; // Computed time from the findMinCost function
    const totalPrice = routeDetails.totalCost; // Computed cost from the findMinCost function

    // Add the final node with 'nextNode' set to null
    const lastNode = routeDetails.route[routeDetails.route.length - 1];
    const finalNodeEntry = {
      node: lastNode.nextNode,
      nextNode: null, // Final destination
      mode: null, // No transport mode for the last node
      price: 0, // No cost for the last node
      startTime: null,
      endTime: null,
    };

    // Append the final entry to the route
    routeDetails.route.push(finalNodeEntry);

    return {
      origin: routeDetails.origin,
      destination: routeDetails.destination,
      totalCost: totalPrice,
      arrivalTime: routeDetails.arrivalTime,
      route: routeDetails.route,
    };
  } catch (error) {
    console.error("Error generating parcel route:", error);
    return { message: "Server error while generating route." };
  }
};

/**
 * Generate a parcel delivery route dynamically based on the condition and minimum cost.
 * @param {String} sourceNode - The starting node
 * @param {String} destNode - The destination node
 * @param {String} parcelId - The parcel ID
 * @param {String} condition - Delivery condition (e.g., "cheapest", "deadline-based")
 * @returns {Object} - Route details including nodes, timings, transport modes, total time, and cost
 */
export const generateParcelRoute1 = async (sourceNode, destNode, parcelId, condition) => {
  console.log("genereating routes");
  try {
    // Use the findMinCost function to calculate the route dynamically
    console.log(sourceNode);
    const routeDetails = findMinCost(sourceNode, destNode, "07:30");

    // If no route found, return an error
    if (!routeDetails || routeDetails.route.length === 0) {
      return { message: "No route found for the specified conditions." };
    }

    const totalTime = routeDetails.totalTime; // Computed time from the findMinCost function
    const totalPrice = routeDetails.totalCost; // Computed cost from the findMinCost function

    return {
      route: routeDetails.route,
      totalTime,
      totalPrice,
    };
  } catch (error) {
    console.error("Error generating parcel route:", error);
    return { message: "Server error while generating route." };
  }
};

// /**
//  * Generate a placeholder route for parcel delivery.
//  * @param {String} sourceNode - The starting node
//  * @param {String} destNode - The destination node
//  * @param {String} parcelId - The parcel ID
//  * @param {String} condition - Delivery condition (e.g., "cheapest", "deadline-based")
//  * @returns {Object} - Placeholder route details including nodes, timings, transport modes, total time, and distance
//  */
// export const generateParcelRoute = async (sourceNode, destNode, parcelId, condition) => {
//   try {
//     // Placeholder response
//     const placeholderRoute = [
//       {
//         node: "A",
//         arrivalTime: "2:35 PM",
//         dispatchTime: "2:45 PM",
//         arrivalMode: {
//           type: "Flight",
//           identifier: "F1"
//         }
//       },
//       {
//         node: "B",
//         arrivalTime: "3:15 PM",
//         dispatchTime: "3:25 PM",
//         arrivalMode: {
//           type: "Truck",
//           identifier: "Tr2"
//         }
//       },
//       {
//         node: "C",
//         arrivalTime: "4:00 PM",
//         dispatchTime: "4:10 PM",
//         arrivalMode: {
//           type: "Train",
//           identifier: "T1"
//         }
//       },
//       {
//         node: "D",
//         arrivalTime: "5:00 PM",
//         dispatchTime: "5:10 PM",
//         arrivalMode: {
//           type: "Truck",
//           identifier: "Tr3"
//         }
//       },
//       {
//         node: "E",
//         arrivalTime: "6:00 PM",
//         dispatchTime: "6:15 PM",
//         arrivalMode: {
//           type: "Flight",
//           identifier: "F2"
//         }
//       },
//       {
//         node: "F",
//         arrivalTime: "7:10 PM",
//         dispatchTime: "7:20 PM",
//         arrivalMode: {
//           type: "Train",
//           identifier: "T2"
//         }
//       }
//     ];

//     const totalTime = "4 hours 35 minutes";
//     const totalDistance = "450 km";

//     // Return the same response for now
//     return {
//       route: placeholderRoute,
//       totalTime,
//       totalPrice
//     };
//   } catch (error) {
//     console.error("Error generating parcel route:", error);
//     return { message: "Server error." };
//   }
// };

/**
 * Accept a parcel and update its history
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
export const acceptParcel = async (req, res) => {
  const { parcelId, nodeName } = req.body;
  console.log(req.body);

  try {
    // Find the parcel by its ID
    const parcel = await Parcel.findOne({ parcelId });

    if (!parcel) {
      return res.status(404).json({ message: 'Parcel not found.' });
    }

    // Get the current date and time
    const currentDate = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
    const currentTime = new Date().toTimeString().split(" ")[0]; // Format: HH:MM:SS
    await changeParcelNotificationStatus(parcelId, nodeName, 'Accepted');
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


export const dispatchParcel = async (req, res) => {
  const { parcelId, nodeName } = req.body;

  try {
    // Validate inputs
    if (!parcelId || !nodeName) {
      return res.status(400).json({ message: "Parcel ID and Node Name are required." });
    }

    // Find the parcel by its ID
    const parcel = await Parcel.findOne({ parcelId });

    if (!parcel) {
      return res.status(404).json({ message: "Parcel not found." });
    }

    // Filter out history entries for the current node with an unlocked status
    parcel.history = parcel.history.filter(
      (event) => !(event.location === nodeName && event.LockStatus === false)
    );

    // Generate the predicted route for the parcel
    const predictedRoute = await generateParcelRoute(
      nodeName,
      parcel.receiver.address.city,
      parcelId,
      parcel.condition
    );

    const notificationMessage = `${parcelId} is arriving`;

    // Process the predicted route and update the parcel's history
    for (const node of predictedRoute.route) {
      parcel.history.push({
        date: new Date().toISOString().split("T")[0],
        time: node.arrivalTime,
        location: node.node,
        status: node.node === nodeName ? "Dispatched" : "Pending",
        LockStatus: node.node === nodeName, // Set true if current node, else false
      });

      // Send notifications to other nodes, excluding the current node
      if (node.node !== nodeName) {
        await sendParcelNotification(parcelId, node.node, notificationMessage, "Pending");
      }
    }

    // Save the updated parcel
    await parcel.save();

    return res.status(200).json({
      message: "Parcel dispatched successfully.",
      parcel,
    });
  } catch (error) {
    console.error("Error dispatching parcel:", error);
    return res.status(500).json({ message: "Server error." });
  }
};


export const dispatchParcel1 = async (req, res) => {
  const { parcelId, nodeName } = req.body;
   console.log('Request Body:', req.body);
  console.log('HI');
  console.log(parcelId);

  try {
    // Find the parcel by its ID
    const parcel = await Parcel.findOne({ parcelId });
    console.log(parcel);
    if (!parcel) {
      return res.status(404).json({ message: "Parcel not found" });
    }

    // Filter the history to remove events based on conditions
    parcel.history = parcel.history.filter(event => {
      return !(event.location === nodeName || event.LockStatus === false);
    });

    console.log(parcel);

    console.log(nodeName);
    console.log(parcel.receiver.address.city);
    console.log(parcelId);
    console.log(parcel.deliveryType);
    // Generate predicted route based on the parcel details
    const predictedRoute = await generateParcelRoute(nodeName, parcel.receiver.address.city, parcelId, parcel.condition);
    console.log(predictedRoute);
    const notificationMessage = `${parcelId} is arriving`;

    // Add the predicted route to the parcel's history
    for (const node of predictedRoute.route) {
      parcel.history.push({
        date: new Date().toISOString().split("T")[0], // Using current date for arrival
        time: node.arrivalTime,
        location: node.node,
        status: "Pending",
        LockStatus: false, // Initial lock status
      });

      // Send a notification for this node
      if (node.node === nodeName) {
        await changeParcelNotificationStatus(parcelId, node.node, 'Dispatched');
        continue;
      }
      try {
        await sendParcelNotification(parcelId, node.node, notificationMessage);
      } catch (notificationError) {
        console.warn(`Failed to send notification to node ${node.node}:`, notificationError.message);
      }
    }

    // Update status to "Dispatched" for the current node
    parcel.history.forEach(node => {
      if (node.location === nodeName) {
        node.status = "Dispatched";
      }
    });

    // Save the updated parcel document
    await parcel.save();

    return res.status(200).json({ message: "Parcel history and notifications updated successfully" });
  } catch (error) {
    console.error("Error dispatching parcel:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

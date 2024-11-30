const mongoose = require("mongoose");

// Helper functions for default values
const getCurrentDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0]; // Format: YYYY-MM-DD
};

const getCurrentTime = () => {
  const now = new Date();
  return now.toTimeString().split(" ")[0]; // Format: HH:MM:SS
};

const ParcelSchema = new mongoose.Schema(
  {
    parcelId: {
      type: String,
      required: true,
      unique: true, // Unique identifier for each parcel
    },
    sender: {
      name: { type: String, required: true }, // Sender's name
      address: { type: String, required: true }, // Sender's address
      contact: { type: String, required: true }, // Sender's contact information
    },
    receiver: {
      name: { type: String, required: true }, // Receiver's name
      address: { type: String, required: true }, // Receiver's address
      contact: { type: String, required: true }, // Receiver's contact information
    },
    currentStatus: {
      type: String,
      required: true,
      enum: ["Processing", "In Transit", "Delivered"], // Status of the parcel
    },
    currentNode: {
      type: String,
      ref: "level1_nodes", // Reference to the current hub or node
    },
    destinationNode: {
      type: String,
      ref: "level2_nodes", // Reference to the destination hub
    },
    deliveryType: {
      type: String,
      enum: ["Fastest", "Cheapest", "Moderate", "Deadline-Based"], // Delivery preference
      required: true,
    },
    deadline: {
      type: Date, // Deadline for delivery, if applicable
    },
    weight: {
      type: Number,
      required: true, // Parcel weight in kilograms
    },
    dimensions: {
      length: { type: Number, required: true }, // Length in cm
      width: { type: Number, required: true }, // Width in cm
      height: { type: Number, required: true }, // Height in cm
    },
    predictedDeliveryTime: {
      type: Date, // Predicted delivery time
    },
    history: [
      {
        date: {
          type: String,
          default: getCurrentDate, // Defaults to today's date (YYYY-MM-DD)
          required: true,
        },
        time: {
          type: String,
          default: getCurrentTime, // Defaults to the current time (HH:MM:SS)
          required: true,
        },
        location: {
          type: String,
          required: true, // Hub or location name
        },
        status: {
          type: String,
          default: "Pending",
          required: true, // Event status (e.g., "Dispatched")
        },
      },
    ],
  },
  {
    timestamps: true, // Automatically manage `createdAt` and `updatedAt` fields
  }
);

module.exports = mongoose.model("Parcel", ParcelSchema);

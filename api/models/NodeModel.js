import mongoose from "mongoose";

const NodeSchema = new mongoose.Schema({
  nodeCategory: {
    type: Number,
    required: true,
    default: 2,
    enum: [1, 2],
  },
  name: { 
    type: String, 
    required: true, 
    unique: true, // Ensures the 'name' is unique across the collection
  }, // Name of the hub
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  transportationModes: {
    type: String,
    enum: ["Flight", "Ship", "Train", "Truck"],
    required: true,
  },
  storageCapacity: {
    type: Number,
    required: true,
  }, // Max storage capacity
  currentLoad: {
    type: Number,
    default: 0,
  }, // Current used capacity
  weatherConditions: {
    type: String,
    enum: ["Good", "Moderate", "Severe"],
    default: "Good",
  },
  L1Connections: [{ type: String }], // Links to other Level 1 hubs (using strings)
  L2Connections: [{ type: String }], // Linked Level 2 nodes (using strings)
  notifications: [
    {
      notificationId: { type: String, ref: "Notification" }, // Reference to the Notification schema
      parcelId: { type: String, required: true }, // Parcel associated with the notification
      message: { type: String, required: true }, // Message content
      status: { 
        type: String, 
        enum: ["Sent", "Pending"], 
        default: "Pending" 
      },
      timestamp: { type: Date, default: Date.now },
    }
  ],
}, { timestamps: true });

const Node = mongoose.model("Node", NodeSchema);
export default Node;

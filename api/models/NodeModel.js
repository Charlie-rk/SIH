import mongoose from "mongoose";

const NodeSchema = new mongoose.Schema({
  nodeCategory: {
    type: Number,
    required: true,
    default: 2,
    // enum: [1, 2],
  },
  nodeId: { type: String, required: true, unique: true }, // Unique ID for the city hub
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
    type: [String], 
    enum: ["Train", "Truck","Ship","Flight"], 
    required: true 
},
  storageCapacity: {
    type: Number,
    required: true,
  }, // Max storage capacity
  currentLoad: {
    type: Number,
    default: 0,
  }, // Current used capacity
  postOffices: [{ type: String }],
  weatherConditions: {
    type: String,
    enum: ["Good", "Moderate", "Severe"],
    default: "Good",
  },
  
  L1Connections: [{ type: String }], // Links to other Level 1 hubs
  L2Connections: [{ type: String }], // Linked Level 2 nodes
  notifications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Notification", // References Notification model
    },
  ],
}, { timestamps: true });

const Node = mongoose.model("Node", NodeSchema);
export default Node;

import mongoose from "mongoose";
const NodeSchema = new mongoose.Schema({
    nodeId: { type: String, required: true, unique: true }, // Unique ID for the hub
    nodeCategory:
    {
        type: Number,
        required: true,
        required: true,
        default: 2,
        enum: [1, 2],
    },
    name: { type: String, required: true }, // Name of the hub
    location: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true }
    },
    transportationModes: {
        type: String,
        enum: ["Flight", "Ship", "Train", "Truck"],
        required: true
    },
    storageCapacity: {
        type: Number,
        required: true
    }, // Max storage capacity
    currentLoad: {
        type: Number,
        default: 0
    }, // Current used capacity
    weatherConditions: {
        type: String,
        enum: ["Good", "Moderate", "Severe"],
        default: "Good"
    },
    L1Connections: [{ type: String, ref: "Node" }], // Links to other Level 1 hubs
    L2Connections: [{ type: String, ref: "Node" }] // Linked Level 2 nodes
}, { timestamps: true });


const Node = mongoose.model("Node", NodeSchema);
export default Node;
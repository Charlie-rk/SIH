const NotificationSchema = new mongoose.Schema({
    notificationId: { type: String, required: true, unique: true },
    parcelId: { type: String, ref: "parcels", required: true },
    message: { type: String, required: true },
    status: { 
        type: String, 
        enum: ["Sent", "Pending"], 
        default: "Pending" 
    },
    timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Notification", NotificationSchema);
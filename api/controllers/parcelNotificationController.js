import NotificationModel from "../models/NotificationModel";
import Parcel from "../models/parcelModel";
import Node from "../models/NodeModel";

export const sendParcelNotification = async (req, res) => {
  const { parcelId, nodeName, message, status } = req.body;

  try {
    // Verify the parcel exists
    const parcel = await Parcel.findOne({ parcelId });
    if (!parcel) {
      return res.status(404).json({ error: "Parcel not found" });
    }

    // Verify the node exists
    const node = await Node.findOne({ name: nodeName });
    if (!node) {
      return res.status(404).json({ error: "Node not found" });
    }

    // Create and save the notification
    const notification = new NotificationModel({
      parcelId,
      message,
      status: status || "Pending", // Default to "Pending" if status is not provided
      node: node._id, // Reference to the node
    });

    await notification.save();

    // Add the notification ID to the node's notifications array
    node.notifications.push(notification._id);
    await node.save();

    return res.status(201).json({
      message: "Notification sent successfully",
      notification,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const changeParcelNotificationStatus = async (req, res) => {
    const { parcelId, nodeName, status } = req.body;
  
    try {
      // Verify that the parcel exists
      const parcel = await Parcel.findOne({ parcelId });
      if (!parcel) {
        return res.status(404).json({ message: "Parcel not found" });
      }
  
      // Find the notification associated with this parcelId and nodeName
      const notification = await NotificationModel.findOne({ parcelId, node: nodeName });
      if (!notification) {
        return res.status(404).json({ message: "Notification not found for the specified node" });
      }
  
      // Update the notification's status
      notification.status = status || notification.status; // Update with provided status or keep the current one if no new status is provided
  
      // Save the updated notification
      await notification.save();
  
      return res.status(200).json({ message: "Notification status updated successfully", notification });
    } catch (error) {
      console.error("Error updating notification status:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  
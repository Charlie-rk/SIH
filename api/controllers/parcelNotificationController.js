import Notification from "../models/NotificationModel.js";
import Parcel from "../models/parcelModel.js";
import Node from "../models/NodeModel.js";

export const sendParcelNotification = async (parcelId, nodeName, message, status) => {
  console.log("Inside sendParcelNotification:", { parcelId, nodeName, message, status });

  try {
    // Verify the parcel exists
    const parcel = await Parcel.findOne({ parcelId });
    if (!parcel) {
      console.error("Parcel not found:", parcelId);
      return { error: "Parcel not found" };
    }

    // Verify the node exists
    const node = await Node.findOne({ name: nodeName });
    if (!node) {
      console.error("Node not found:", nodeName);
      return { error: "Node not found" };
    }

    console.log("Node found:", node);

    // Create and save the notification
    const notification = new Notification({
      parcelId,
      message,
      status: status || "Pending", // Default status if not provided
      node: node._id, // Reference to the Node
    });

    await notification.save();
    console.log("Notification created and saved:", notification);

    // Ensure `notifications` array exists before pushing
    if (!Array.isArray(node.notifications)) {
      node.notifications = [];
    }
    node.notifications.push(notification._id);
    await node.save();

    console.log("Notification linked to Node and saved successfully");

    // Return success message
    return {
      message: "Notification sent successfully",
      notification,
    };
  } catch (error) {
    console.error("Error in sendParcelNotification:", error);
    return { error: "Internal server error" };
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
  

  export const getAllNotifications = async (req, res) => {
    const { nodeName } = req.body;
  
    try {
      if (!nodeName) {
        return res.status(400).json({ message: "Node name is required." });
      }
  
      // Find the node by name
      const node = await Node.findOne({ name: nodeName }).populate("notifications");
  
      if (!node) {
        return res.status(404).json({ message: "Node not found." });
      }
  
      // Populate notifications and return them
      const notifications = await Notification.find({ node: node._id });
      console.log(notifications);
      return res.status(200).json({
        message: "Notifications retrieved successfully.",
        notifications,
      });
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return res.status(500).json({ message: "Server error." });
    }
  };
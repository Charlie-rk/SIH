/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux"; // Redux hooks
import axios from "axios";
// import { updateParcelStatus } from "../redux/actions/parcelActions"; // Redux action for parcel updates
import { toast } from "react-toastify"; // For notifications (optional)
import { Alert } from "flowbite-react";

const ParcelStatusUpdate = () => {
  const [parcelId, setParcelId] = useState("");
  const [status, setStatus] = useState("");

//   const level2Node = useSelector((state) => state.level2Node); // Assuming this contains the Level2Node data
  const dispatch = useDispatch();

  const level2Node={
    nodeId: "L2NODE001",
  name: "City Hub 1",
  level1Link: "L1NODE123",
  location: {
    latitude: 28.6139,
    longitude: 77.209,
  },
  postOffices: ["PO123", "PO124", "PO125"],
  transportationModes: ["Train", "Truck"],
  storageCapacity: 1000,
  currentLoad: 650,
  };

  const handleStatusUpdate = async () => {
    if (!parcelId || !status) {
        // Alert("hii")
      toast.error("Parcel ID and status are required.");
      return;
    }

    try {
      // Call the API to update the status
    //   await axios.post(`/api/parcels/${parcelId}/updateStatus`, { status });
      
      // Dispatch an action to update the Redux store
    //   dispatch(updateParcelStatus(parcelId, status));
      
      toast.success("Parcel status updated successfully.");
      setParcelId("");
      setStatus("");
    } catch (error) {
      toast.error("Failed to update parcel status.");
    }
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-all">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-700 shadow-md rounded-lg p-6 transition-all">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Level 2 Node Dashboard</h1>

        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300">Node Information</h2>
          <div className="p-4 bg-gray-100 dark:bg-gray-600 rounded-lg mt-2 shadow-2xl">
            <p className="text-gray-800 dark:text-gray-200">
              <strong>Node ID:</strong> {level2Node.nodeId}
            </p>
            <p className="text-gray-800 dark:text-gray-200">
              <strong>Name:</strong> {level2Node.name}
            </p>
            <p className="text-gray-800 dark:text-gray-200">
              <strong>Location:</strong> {level2Node.location.latitude}, {level2Node.location.longitude}
            </p>
            <p className="text-gray-800 dark:text-gray-200">
              <strong>Current Load:</strong> {level2Node.currentLoad} / {level2Node.storageCapacity}
            </p>
            <p className="text-gray-800 dark:text-gray-200">
              <strong>Transportation Modes:</strong> {level2Node.transportationModes.join(", ")}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300">Update Parcel Status</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter Parcel ID"
              value={parcelId}
              onChange={(e) => setParcelId(e.target.value)}
               className="block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
               className="block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Select Status
              </option>
              <option value="Received">Received</option>
              <option value="Dispatch">Dispatch</option>
            </select>
            <button
              onClick={handleStatusUpdate}
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Update Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParcelStatusUpdate;

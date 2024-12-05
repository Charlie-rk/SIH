/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Modal, Sidebar } from "flowbite-react";
import { MapPinCheckIcon, Cloud, AlertCircle, Archive, Truck, Home, Train } from "lucide-react";

export default function Level1DashBoard() {
  const [level2Nodes, setLevel2Nodes] = useState([]);
  const [nodeDetails, setNodeDetails] = useState({});
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
const [modalType, setModalType] = useState(""); // Either 'message' or 'alert'
const [selectedNode, setSelectedNode] = useState(null);
const [messageContent, setMessageContent] = useState("");

  useEffect(() => {
    // Simulate API call to fetch Level 1 Node data
    setTimeout(() => {
      // Example mock data for the Level 1 Node
      setNodeDetails({
        nodeId: "L1-001",
        name: "Main Airport Hub",
        location: { latitude: 40.7128, longitude: -74.006 },
        transportationModes: ["Flight", "Truck"],
        storageCapacity: 5000,
        currentLoad: 3500,
        weatherConditions: "Good",
      });

      setLevel2Nodes([
        {
          nodeId: "L2-101",
          name: "City Hub A",
          location: { latitude: 39.9526, longitude: -75.1652 },
          postOffices: ["Post Office 1", "Post Office 2"],
          transportationModes: ["Truck"],
          storageCapacity: 3000,
          currentLoad: 1500,
        },
        {
          nodeId: "L2-102",
          name: "City Hub B",
          location: { latitude: 34.0522, longitude: -118.2437 },
          postOffices: ["Post Office 3", "Post Office 4"],
          transportationModes: ["Truck", "Train"],
          storageCapacity: 4000,
          currentLoad: 3000,
        },
        {
          nodeId: "L2-103",
          name: "City Hub C",
          location: { latitude: 41.8781, longitude: -87.6298 },
          postOffices: ["Post Office 5"],
          transportationModes: ["Train"],
          storageCapacity: 2000,
          currentLoad: 800,
        },
        {
          nodeId: "L2-103",
          name: "City Hub C",
          location: { latitude: 41.8781, longitude: -87.6298 },
          postOffices: ["Post Office 5"],
          transportationModes: ["Train"],
          storageCapacity: 2000,
          currentLoad: 800,
        },
        {
          nodeId: "L2-103",
          name: "City Hub C",
          location: { latitude: 41.8781, longitude: -87.6298 },
          postOffices: ["Post Office 5"],
          transportationModes: ["Train"],
          storageCapacity: 2000,
          currentLoad: 800,
        },
        {
          nodeId: "L2-103",
          name: "City Hub C",
          location: { latitude: 41.8781, longitude: -87.6298 },
          postOffices: ["Post Office 5"],
          transportationModes: ["Train"],
          storageCapacity: 2000,
          currentLoad: 800,
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);



  const handleSendMessage = (nodeId) => {
    setModalType("message");
    setSelectedNode(nodeId);
    setIsModalOpen(true);
  };

  const handleSendAlert = (nodeId) => {
    setModalType("alert");
    setSelectedNode(nodeId);
    setIsModalOpen(true);
  };

  const handleGlobalMessage = () => {
    setModalType("message");
    setSelectedNode("all");
    setIsModalOpen(true);
  };

  const handleGlobalAlert = () => {
    setModalType("alert");
    setSelectedNode("all");
    setIsModalOpen(true);
  };

  const sendNotification = async () => {
    try {
      const endpoint = selectedNode === "all" ? "/api/notify/all" : `/api/notify/${selectedNode}`;
      await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: modalType,
          message: messageContent,
        }),
      });
      alert(`${modalType === "message" ? "Message" : "Alert"} sent successfully`);
    } catch (error) {
      console.error("Error sending notification:", error);
      alert("Failed to send notification");
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }


  return (
    <div className="min-h-screen flex flex-col md:flex-row mt-10 bg-gray-200 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      {/* Sidebar Section */}
      <div className="md:w-80 bg-gray-500">
        <Sidebar>
          <div className="p-4 shadow-2xl bg-gray-200 rounded-md dark:bg-slate-600 my-2">
            <h3 className="text-center font-bold text-xl mb-4">Level 1 Node</h3>
            <p className="mb-2"><strong>Name:</strong> {nodeDetails.name}</p>
            <p className="mb-2">
            <MapPinCheckIcon className="text-green-500 font-extrabold size-8" />
              <strong>Location:</strong> Latitude {nodeDetails.location.latitude}, Longitude{" "}
              {nodeDetails.location.longitude}
            </p>
            <p className="mb-2">
            <Truck className="text-blue-500  size-8" />
              <strong>Transportation:</strong> {nodeDetails.transportationModes.join(", ")}
            </p>
            <p className="mb-2">
            <Archive className="text-orange-400 dark:text-yellow-200 size-8 " />
              <strong>Storage:</strong> {nodeDetails.currentLoad}/{nodeDetails.storageCapacity} kg
            </p>
            <p className="mb-2">
            <Cloud className="text-blue-400  size-8" />
              <strong>Weather:</strong> {nodeDetails.weatherConditions}
            </p>
          </div>
        </Sidebar>
      </div>

      {/* Main Content Section */}
      <div className="w-full p-">
        <h3 className="text-center p-4 dark:text-black font-bold  bg-gradient-to-r from-blue-700 via-blue-100 to-blue-800">
          Connected Level 2 Nodes
        </h3>
        <div className="flex justify-end gap-4 mb-4 mt-2">
          {/* Global Buttons */}
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-700"
            onClick={handleGlobalMessage}
          >
            Send Message to All
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-md shadow hover:bg-red-700"
            onClick={handleGlobalAlert}
          >
            Send Alert to All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {level2Nodes.map((node) => (
            <div
              key={node.nodeId}
              className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow-2xl"
            >
              <h4 className="text-lg font-semibold mb-2">{node.name}</h4>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <MapPinCheckIcon size={18} className="text-green-500" />
                  <span>
                    <strong>Location:</strong> Latitude {node.location.latitude}, Longitude {node.location.longitude}
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <Home size={18} className="text-orange-400" />
                  <span>
                    <strong>Post Offices:</strong> {node.postOffices.join(", ")}
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <Truck size={18} className="text-blue-500" />
                  <Train size={18} className="text-blue-600" />
                  <span>
                    <strong>Transport:</strong> {node.transportationModes.join(", ")}
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <Archive size={18} className="text-orange-500 dark:text-yellow-300" />
                  <span>
                    <strong>Storage:</strong> {node.currentLoad}/{node.storageCapacity} kg
                  </span>
                </li>
              </ul>
              <div className="flex justify-between mt-4">
                <button
                  className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-700"
                  onClick={() => handleSendMessage(node.nodeId)}
                >
                  Send Message
                </button>
                <button
                  className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-700"
                  onClick={() => handleSendAlert(node.nodeId)}
                >
                  Send Alert
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
  <Modal.Header> <div className="flex items-center gap-2">
      {modalType === "alert" ? (
        <span className="text-red-600">
          {/* Alert symbol */}
          ⚠️
        </span>
      ) : (
        <span className="text-blue-600">
          {/* Message symbol */}
          📩
        </span>
      )}
      <h2 className="text-lg font-semibold">
        {modalType === "alert" ? "Send Alert" : "Send Message"}
      </h2>
    </div></Modal.Header>
  <Modal.Body  className={`rounded-lg ${
    modalType === "alert" ? "bg-red-200" : "bg-blue-200"
  }`}>
    <textarea
      className="w-full p-2 border rounded-md"
      rows="4"
      placeholder={`Enter your ${modalType === "message" ? "message" : "alert"} here...`}
      value={messageContent}
      onChange={(e) => setMessageContent(e.target.value)}
    ></textarea>
  </Modal.Body>
  <Modal.Footer>
    <button
      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
      onClick={() => {
        sendNotification();
        setIsModalOpen(false);
      }}
    >
      Submit
    </button>
    <button
      className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
      onClick={() => setIsModalOpen(false)}
    >
      Cancel
    </button>
  </Modal.Footer>
</Modal>
    </div>
  );
}
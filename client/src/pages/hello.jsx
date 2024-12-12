import React, { useState } from 'react';
import { Modal, Button } from 'flowbite-react';

const Dashboard = () => {
  const [showModal, setShowModal] = useState(true);
  const [predictedPath, setPredictedPath] = useState([]);

  const handleDispatchClick = () => {
    // Hardcoded predicted path for now
    const hardcodedPath = [
      { node: "Source", time: "10:00 AM" },
      { node: "Intermediate Node 1", time: "11:00 AM" },
      { node: "Intermediate Node 2", time: "12:30 PM" },
      { node: "Destination", time: "2:00 PM" },
    ];
    setPredictedPath(hardcodedPath);
    setShowModal(true);
  };

  return (
    <div>
      {/* Dispatch button */}
      <Button
        onClick={(e) => {
          e.stopPropagation(); // Prevent row click event
          handleApplyAlgo(bundle.id);
        }}
        disabled={loading}
        color="dark"
      >
        {loading ? <Spinner size="sm" light /> : 'Dispatch'}
      </Button>

      {/* Modal to display predicted path */}
      {showModal && (
        <Modal show={true} onClose={() => setShowModal(false)}>
          <Modal.Header>
            <span className="text-lg font-semibold">Predicted Path</span>
          </Modal.Header>
          <Modal.Body>
            <div className="space-y-4">
              <p className="text-gray-700">
                Below is the predicted path for the dispatched bundle:
              </p>
              <ol className="list-decimal pl-6">
                {predictedPath.map((node, index) => (
                  <li key={index} className="mb-2">
                    <span className="font-semibold">{node.node}</span> 
                    {node.time && (
                      <span className="text-sm text-gray-500 ml-2">
                        (Arrival Time: {node.time})
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button color="gray" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default Dashboard;

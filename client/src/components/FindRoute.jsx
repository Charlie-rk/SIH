// src/components/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Spinner } from 'flowbite-react';
import axios from 'axios';

const Dashboard = () => {
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageContent, setMessageContent] = useState(false);

  // Mock data fetching
  useEffect(() => {
    // Replace this with actual API call
    const mockBundles = [
        { 
            id: 'B001', 
            senderNode: 'Node A', 
            receiverNode: 'Node D', 
            status: 'on-time', 
            parcels: [
              { parcelId: 'P001', mailId: 'M123', weight: '2kg', dimensions: '30x20x15 cm' },
              { parcelId: 'P002', mailId: 'M124', weight: '3kg', dimensions: '25x25x20 cm' },
              { parcelId: 'P003', mailId: 'M125', weight: '1kg', dimensions: '15x10x8 cm' },
              { parcelId: 'P004', mailId: 'M126', weight: '5kg', dimensions: '40x30x20 cm' },
              { parcelId: 'P005', mailId: 'M127', weight: '2.5kg', dimensions: '35x25x18 cm' }
            ]
          },
          { 
            id: 'B002', 
            senderNode: 'Node B', 
            receiverNode: 'Node E', 
            status: 'delayed', 
            parcels: [
              { parcelId: 'P006', mailId: 'M128', weight: '3kg', dimensions: '28x22x18 cm' },
              { parcelId: 'P007', mailId: 'M129', weight: '2.5kg', dimensions: '32x24x16 cm' },
              { parcelId: 'P008', mailId: 'M130', weight: '1.2kg', dimensions: '22x18x12 cm' },
              { parcelId: 'P009', mailId: 'M131', weight: '4kg', dimensions: '38x30x22 cm' },
              { parcelId: 'P010', mailId: 'M132', weight: '6kg', dimensions: '45x35x25 cm' }
            ]
          },
          { 
            id: 'B003', 
            senderNode: 'Node C', 
            receiverNode: 'Node F', 
            status: 'on-time', 
            parcels: [
              { parcelId: 'P011', mailId: 'M133', weight: '1.5kg', dimensions: '20x15x10 cm' },
              { parcelId: 'P012', mailId: 'M134', weight: '3.2kg', dimensions: '28x22x14 cm' },
              { parcelId: 'P013', mailId: 'M135', weight: '2kg', dimensions: '25x20x12 cm' },
              { parcelId: 'P014', mailId: 'M136', weight: '4.5kg', dimensions: '35x25x20 cm' },
              { parcelId: 'P015', mailId: 'M137', weight: '3.8kg', dimensions: '40x30x18 cm' }
            ]
          },
          { 
            id: 'B004', 
            senderNode: 'Node G', 
            receiverNode: 'Node H', 
            status: 'delayed', 
            parcels: [
              { parcelId: 'P016', mailId: 'M138', weight: '3kg', dimensions: '33x28x22 cm' },
              { parcelId: 'P017', mailId: 'M139', weight: '5.5kg', dimensions: '50x40x30 cm' },
              { parcelId: 'P018', mailId: 'M140', weight: '2.1kg', dimensions: '25x20x12 cm' },
              { parcelId: 'P019', mailId: 'M141', weight: '4.2kg', dimensions: '45x35x20 cm' },
              { parcelId: 'P020', mailId: 'M142', weight: '3.5kg', dimensions: '38x28x18 cm' }
            ]
          },
          { 
            id: 'B005', 
            senderNode: 'Node I', 
            receiverNode: 'Node J', 
            status: 'on-time', 
            parcels: [
              { parcelId: 'P021', mailId: 'M143', weight: '2kg', dimensions: '30x25x15 cm' },
              { parcelId: 'P022', mailId: 'M144', weight: '3kg', dimensions: '28x24x16 cm' },
              { parcelId: 'P023', mailId: 'M145', weight: '4kg', dimensions: '35x30x20 cm' },
              { parcelId: 'P024', mailId: 'M146', weight: '1kg', dimensions: '20x15x10 cm' },
              { parcelId: 'P025', mailId: 'M147', weight: '2.5kg', dimensions: '25x20x15 cm' }
            ]
          },
          { 
            id: 'B006', 
            senderNode: 'Node K', 
            receiverNode: 'Node L', 
            status: 'on-time', 
            parcels: [
              { parcelId: 'P026', mailId: 'M148', weight: '3.2kg', dimensions: '28x22x14 cm' },
              { parcelId: 'P027', mailId: 'M149', weight: '2kg', dimensions: '25x20x12 cm' },
              { parcelId: 'P028', mailId: 'M150', weight: '1.5kg', dimensions: '20x15x10 cm' },
              { parcelId: 'P029', mailId: 'M151', weight: '4.8kg', dimensions: '40x30x20 cm' },
              { parcelId: 'P030', mailId: 'M152', weight: '3.5kg', dimensions: '35x25x15 cm' }
            ]
          },
          { 
            id: 'B007', 
            senderNode: 'Node M', 
            receiverNode: 'Node N', 
            status: 'delayed', 
            parcels: [
              { parcelId: 'P031', mailId: 'M153', weight: '4kg', dimensions: '38x28x18 cm' },
              { parcelId: 'P032', mailId: 'M154', weight: '2kg', dimensions: '25x20x12 cm' },
              { parcelId: 'P033', mailId: 'M155', weight: '3kg', dimensions: '30x25x15 cm' },
              { parcelId: 'P034', mailId: 'M156', weight: '1.8kg', dimensions: '28x22x14 cm' },
              { parcelId: 'P035', mailId: 'M157', weight: '5.2kg', dimensions: '50x40x30 cm' }
            ]
          },
          { 
            id: 'B008', 
            senderNode: 'Node O', 
            receiverNode: 'Node P', 
            status: 'on-time', 
            parcels: [
              { parcelId: 'P036', mailId: 'M158', weight: '2kg', dimensions: '30x25x15 cm' },
              { parcelId: 'P037', mailId: 'M159', weight: '1.2kg', dimensions: '22x18x12 cm' },
              { parcelId: 'P038', mailId: 'M160', weight: '3kg', dimensions: '28x22x16 cm' },
              { parcelId: 'P039', mailId: 'M161', weight: '2.8kg', dimensions: '30x25x18 cm' },
              { parcelId: 'P040', mailId: 'M162', weight: '3.5kg', dimensions: '35x30x20 cm' }
            ]
          },
          { 
            id: 'B009', 
            senderNode: 'Node Q', 
            receiverNode: 'Node R', 
            status: 'delayed', 
            parcels: [
              { parcelId: 'P041', mailId: 'M163', weight: '5kg', dimensions: '45x35x25 cm' },
              { parcelId: 'P042', mailId: 'M164', weight: '2kg', dimensions: '30x20x15 cm' },
              { parcelId: 'P043', mailId: 'M165', weight: '3kg', dimensions: '35x25x18 cm' },
              { parcelId: 'P044', mailId: 'M166', weight: '4kg', dimensions: '40x30x20 cm' },
              { parcelId: 'P045', mailId: 'M167', weight: '6kg', dimensions: '50x40x30 cm' }
            ]
          },
          { 
            id: 'B010', 
            senderNode: 'Node S', 
            receiverNode: 'Node T', 
            status: 'on-time', 
            parcels: [
              { parcelId: 'P046', mailId: 'M168', weight: '3kg', dimensions: '35x28x18 cm' },
              { parcelId: 'P047', mailId: 'M169', weight: '2kg', dimensions: '28x22x16 cm' },
              { parcelId: 'P048', mailId: 'M170', weight: '4kg', dimensions: '40x30x20 cm' },
              { parcelId: 'P049', mailId: 'M171', weight: '2.5kg', dimensions: '32x24x18 cm' },
              { parcelId: 'P050', mailId: 'M172', weight: '3.5kg', dimensions: '38x28x22 cm' }
            ]
          },
        ];
        setBundles(mockBundles);
      }, []);

  const handleRowClick = (bundle) => {
    setSelectedBundle(bundle);
    setShowModal(true);
  };

  const handleApplyAlgo = async (bundleId) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const updatedBundles = bundles.map((bundle) =>
        bundle.id === bundleId ? { ...bundle, optimizedPath: 'Optimized Route X' } : bundle
      );
      setBundles(updatedBundles);
      setLoading(false);
      alert(`Optimized path applied for bundle ID: ${bundleId}`);
    }, 2000);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 mt-12">Dynamic Mail Transmission Dashboard</h1>
      <div className="overflow-x-auto">
        <Table>
          <Table.Head>
            <Table.HeadCell>Bundle ID</Table.HeadCell>
            <Table.HeadCell>Sender Node</Table.HeadCell>
            <Table.HeadCell>Receiver Node</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {bundles.map((bundle) => (
              <Table.Row
                key={bundle.id}
                className="bg-white hover:bg-gray-100 cursor-pointer"
                onClick={() => handleRowClick(bundle)}
              >
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900">
                  {bundle.id}
                </Table.Cell>
                <Table.Cell>{bundle.senderNode}</Table.Cell>
                <Table.Cell>{bundle.receiverNode}</Table.Cell>
                <Table.Cell>
                  {bundle.status === 'delayed' ? (
                    <span className="text-red-500">Delayed</span>
                  ) : (
                    <span className="text-green-500">On Time</span>
                  )}
                </Table.Cell>
                <Table.Cell>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent row click event
                      handleApplyAlgo(bundle.id);
                    }}
                    disabled={loading}
                    color="light"
                  >
                    {loading ? <Spinner size="sm" light /> : 'Accept'}
                  </Button>
                </Table.Cell>
                <Table.Cell>
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
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>

      {/* Modal for Bundle Details */}
        {selectedBundle && (
        <Modal show={showModal} onClose={() => setShowModal(false)} size="lg">
            <Modal.Header>Bundle Details</Modal.Header>
            <Modal.Body>
            <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-start">
                    <div className="mb-4 md:mb-0">
                    <span className="text-lg font-semibold text-gray-700">Bundle ID:</span>
                    <p className="text-xl font-bold text-gray-900">{selectedBundle.id}</p>
                    </div>
                    <div>
                    <span className="text-lg font-semibold text-gray-700">Sender Node:</span>
                    <p className="text-lg text-gray-900">{selectedBundle.senderNode}</p>
                    </div>
                </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-start">
                    <div className="mb-4 md:mb-0">
                    <span className="text-lg font-semibold text-gray-700">Receiver Node:</span>
                    <p className="text-lg text-gray-900">{selectedBundle.receiverNode}</p>
                    </div>
                    <div>
                    <span className="text-lg font-semibold text-gray-700">Optimized Path:</span>
                    <p className="text-lg text-gray-900">
                        {selectedBundle.optimizedPath || 'Not Optimized'}
                    </p>
                    </div>
                </div>
                </div>

                <div className="mt-6">
                <h3 className="text-2xl font-semibold text-gray-800">Parcel Details</h3>
                <div className="mt-4">
                    <ul className="space-y-4">
                    {selectedBundle.parcels.map((parcel) => (
                        <li key={parcel.id} className="bg-gray-100 p-4 rounded-lg shadow-md">
                        <div className="flex flex-col sm:flex-row justify-between items-start">
                            <div className="sm:w-1/2">
                            <div className="text-lg font-semibold text-gray-700">Parcel ID:</div>
                            <p className="text-md text-gray-900">{parcel.id}</p>
                            </div>
                            <div className="sm:w-1/2 mt-4 sm:mt-0">
                            <div className="text-lg font-semibold text-gray-700">Status:</div>
                            <p
                                className={`text-md font-medium ${
                                parcel.status === 'Delivered'
                                    ? 'text-green-500'
                                    : parcel.status === 'In Transit'
                                    ? 'text-blue-500'
                                    : 'text-red-500'
                                }`}
                            >
                                {parcel.status}
                            </p>
                            </div>
                        </div>
                        <div className="mt-4 sm:flex sm:justify-between">
                            <div className="sm:w-1/2">
                            <div className="text-md font-semibold text-gray-700">Sender:</div>
                            <p className="text-sm text-gray-900">{parcel.sender}</p>
                            </div>
                            <div className="sm:w-1/2 mt-4 sm:mt-0">
                            <div className="text-md font-semibold text-gray-700">Receiver:</div>
                            <p className="text-sm text-gray-900">{parcel.receiver}</p>
                            </div>
                        </div>
                        <div className="mt-4 sm:flex sm:justify-between">
                            <div className="sm:w-1/2">
                            <div className="text-md font-semibold text-gray-700">Weight:</div>
                            <p className="text-sm text-gray-900">{parcel.weight}</p>
                            </div>
                            <div className="sm:w-1/2 mt-4 sm:mt-0">
                            <div className="text-md font-semibold text-gray-700">Dimensions:</div>
                            <p className="text-sm text-gray-900">{parcel.dimensions}</p>
                            </div>
                        </div>
                        <div className="mt-4 sm:flex sm:justify-between">
                             <div className="sm:w-1/2">
                            <div className="text-md font-semibold text-gray-700">Destination:</div>
                            <p className="text-sm text-gray-900">{parcel.destination}</p>
                            </div>
                            <div className="sm:w-1/2 mt-4 sm:mt-0">
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
                            </div>
                        </div>
                        </li>
                    ))}
                    </ul>
                </div>
                </div>
            </div>
            </Modal.Body>
            <Modal.Footer>
            <Button onClick={() => setShowModal(false)} color="gray">
                Close
            </Button>
            </Modal.Footer>
        </Modal>
        )}
    </div>
  );
};

export default Dashboard;




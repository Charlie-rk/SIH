// src/components/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Spinner } from 'flowbite-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const Dashboard = () => {
  const MySwal = withReactContent(Swal);
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [groups, setGroups] = useState(null);

  // Mock data fetching
  useEffect(() => {
    // Replace this with actual API call
    const normalWeather = [
      "Jalandhar - Amritsar - 20 - Truck - 8:30 to 9:00 - Rs 1400",
      "Patiyala - Amritsar - 30 - Train - 8:00 to 8:40 - Rs 1500",
      "Amritsar - Bombay - 60 - Flight - 10:30 to 12:00 - Rs 20000",
      "Bombay - Chennai - 60 - Flight - 14:00 to 16:00 - Rs 15000",
      "Chennai - Coimbatore - 20 - Train - 16:30 to 17:00 - Rs 1200",
      "Chennai - Vellore - 10 - Train - 17:00 to 17:30 - Rs 500",
      "Jalandhar - Madurai - 30 - Truck - 16:15 to 17:00 - Rs 600"
    ]

    const harshWeather = [
      "Jalandhar - Amritsar - 20 - Truck - 8:30 to 9:00 - Rs 1400",
      "Patiyala - Amritsar - 30 - Train - 8:00 to 8:40 - Rs 1500",
      "Amritsar - Kolkata - 60 - Flight - 11:30 to 12:00 - Rs 25000",
      "Kolkata - Chennai - 60 - Flight - 14:00 to 17:00 - Rs 24000",
      "Chennai - Coimbatore - 20 - Train - 17:30 to 18:00 - Rs 1200",
      "Chennai - Vellore - 10 - Train - 18:00 to 18:30 - Rs 500",
      "Jalandhar - Madurai - 30 - Truck - 17:15 to 18:00 - Rs 800"
    ]

    const bundles = [];

    async function fetchGroups(nodeName) {
      try {
        // Make a POST request to the backend API
        const response = await fetch('/api/parcel/makeGroups', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ nodeName }), // Pass nodeName as the payload
        });
        
        // Check if the response is okay
        if (!response.ok) {
          throw new Error(`Failed to fetch groups: ${response.statusText}`);
        }
    
        // Parse the JSON response
        const data = await response.json();
        console.log(data);
        return data; // Contains the groups object
      } catch (error) {
        console.error('Error fetching groups:', error);
        throw error;
      }
    }

    (async () => {
      try {
        const nodeName = 'Jalandhar';
        const groups = await fetchGroups(nodeName);
        setGroups(groups);
        console.log(groups);
      } catch (error) {
        console.error('Error:sp', error);
      }
    })();

    const mockBundles = [
        { 
            id: 'B001', 
            senderNode: 'Jalandhar', 
            receiverNode: 'Madurai', 
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
            senderNode: 'Patiyala', 
            receiverNode: 'Madurai', 
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
            senderNode: 'Patiyala', 
            receiverNode: 'Vellore', 
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
            senderNode: 'Patiyala', 
            receiverNode: 'Coimbatore', 
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
            senderNode: 'Amritsar', 
            receiverNode: 'Coimbatore', 
            status: 'on-time', 
            parcels: [
              { parcelId: 'P021', mailId: 'M143', weight: '2kg', dimensions: '30x25x15 cm' },
              { parcelId: 'P022', mailId: 'M144', weight: '3kg', dimensions: '28x24x16 cm' },
              { parcelId: 'P023', mailId: 'M145', weight: '4kg', dimensions: '35x30x20 cm' },
              { parcelId: 'P024', mailId: 'M146', weight: '1kg', dimensions: '20x15x10 cm' },
              { parcelId: 'P025', mailId: 'M147', weight: '2.5kg', dimensions: '25x20x15 cm' }
            ]
          }
        ];
        setBundles(mockBundles);
      }, []);

  const handleRowClick = (bundle) => {
    setSelectedBundle(bundle);
    setShowModal(true);
  };

  const handleApplyAlgo = async (bundleId) => {
    const weatherGood = Math.random()%2;
    
    if(weatherGood)
    {
      MySwal.fire({
        icon: "success",
        title: "PATH",
        text: "Jalandhar - Amritsar - 20 - Truck - 8:30 to 9:00 - Rs 1400, Patiyala - Amritsar - 30 - Train - 8:00 to 8:40 - Rs 1500, Amritsar - Bombay - 60 - Flight - 10:30 to 12:00 - Rs 20000, Bombay - Chennai - 60 - Flight - 14:00 to 16:00 - Rs 15000, Chennai - Coimbatore - 20 - Train - 16:30 to 17:00 - Rs 1200, Chennai - Vellore - 10 - Train - 17:00 to 17:30 - Rs 500, Jalandhar - Madurai - 30 - Truck - 16:15 to 17:00 - Rs 600".split(",").join("\n"),
      });
    }
    else 
    {
      MySwal.fire({
        icon: "success",
        title: "PATH",
        text: "Jalandhar - Amritsar - 20 - Truck - 8:30 to 9:00 - Rs 1400, Patiyala - Amritsar - 30 - Train - 8:00 to 8:40 - Rs 1500, Amritsar - Kolkata - 60 - Flight - 11:30 to 12:00 - Rs 25000, Kolkata - Chennai - 60 - Flight - 14:00 to 17:00 - Rs 24000, Chennai - Coimbatore - 20 - Train - 17:30 to 18:00 - Rs 1200, Chennai - Vellore - 10 - Train - 18:00 to 18:30 - Rs 500, Jalandhar - Madurai - 30 - Truck - 17:15 to 18:00 - Rs 800".split(",").join("\n"),
      });
    }
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const updatedBundles = bundles.map((bundle) =>
        bundle.id === bundleId ? { ...bundle, optimizedPath: 'Optimized Route X' } : bundle
      );
      setBundles(updatedBundles);
      setLoading(false);

      // alert("Hello");

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
            <Table.HeadCell>Parcels</Table.HeadCell>
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
                    <span className="text-red-500">Pending</span>
                  ) : (
                    <span className="text-green-500">Dispatched</span>
                  )}
                </Table.Cell>
                <Table.Cell>5</Table.Cell>
                <Table.Cell>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent row click event
                      handleApplyAlgo(bundle.id);
                    }}
                    disabled={loading}
                    color="dark"
                  >
                    {loading ? <Spinner size="sm" light /> : 'Optimized Path'}
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
                                {loading ? <Spinner size="sm" light /> : 'Send Message'}
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




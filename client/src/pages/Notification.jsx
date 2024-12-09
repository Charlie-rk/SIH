/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { AlertCircle, RefreshCw, CloudRain } from 'lucide-react';
import { useSelector } from 'react-redux';



const Notification = () => {
  const { currentUser } = useSelector((state) => state.user);
  console.log(currentUser);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Active');
  const [filter, setFilter] = useState('All');
  console.log(currentUser.name);
  // const nodeName={nodeName:currentUser.name} ; 
  const nodeName={nodeName:"Ghaziabad"} ; 
   // Fetch notifications from backend
   useEffect(() => {
    const fetchNotifications = async () => {
      try {

        const res = await fetch("/api/parcelNotification/getAllNotifications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nodeName),
        });
        const data = await res.json();
        console.log(data);
       
        setNotifications(data.notifications);
        console.log(notifications);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);
  // Dummy notifications data

  // Filter notifications based on selected type
  const filteredNotifications =
    activeTab === 'All'
      ? notifications
      : notifications.filter((notification) => notification.status === activeTab);
    // Handle Accept button click
    const handleAccept = async (id) => {
      try {
        // Call API to update status to "Accepted"
        console.log(`Accepting notification with ID: ${id}`);
        // Replace with actual API call if required
      } catch (error) {
        console.error('Error accepting notification:', error);
      }
    };

     // Handle Dispatch button click
  const handleDispatch = async (id) => {
    try {
      // Call API to update status to "Dispatched"
      console.log(`Dispatching notification with ID: ${id}`);
      // Replace with actual API call if required
    } catch (error) {
      console.error('Error dispatching notification:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-600 p-10 mt-10 px-80">
      <div className="bg-white dark:bg-slate-500 rounded-lg shadow-2xl p-6 px-10">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Notifications
        </h1>
         {/* Dropdown for filtering */}
         <div className="mb-4">
          <label htmlFor="filter" className="mr-2 text-gray-800 dark:text-gray-200">
            Filter by status:
          </label>
          <select
            id="filter"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="p-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="Dispatched">Dispatched</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center text-gray-700 dark:text-gray-300">Loading...</div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div
                key={notification._id}
                className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg flex items-center justify-between"
              >
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    Parcel ID: {notification.parcelId}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">
                    {notification.message}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(notification.timestamp).toLocaleString()}
                  </div>
                </div>
                <div className="flex space-x-4">
                  {notification.status === 'Pending' && (
                    <>
                      <button
                        onClick={() => handleAccept(notification._id)}
                        className="hover:scale-105 transition-transform bg-gradient-to-r shadow-2xl  from-green-900 via-green-700 to-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleDispatch(notification._id)}
                        className="hover:scale-105 transition-transform bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                      >
                        Dispatch
                      </button>
                    </>
                  )}
                  {notification.status === 'Accepted' && (
                    <button
                      onClick={() => handleDispatch(notification._id)}
                      className="hover:scale-105 transition-transform bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500  text-white px-4 py-2 rounded disabled:opacity-50"
                    >
                      Dispatch
                    </button>
                  )}
                  {notification.status === 'Dispatched' && (
                    <div className= "hover:scale-105 transition-transform text-gray-500 dark:text-gray-400">
                      Dispatched
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notification;

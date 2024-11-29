import { useState } from 'react';
import { AlertCircle, RefreshCw, CloudRain } from 'lucide-react';

const Notification = () => {
  const [activeTab, setActiveTab] = useState('Active');
  const [filter, setFilter] = useState('All');

  // Dummy notifications data
  const notifications = [
    {
      id: 'DMT12345',
      type: 'Delay',
      message: 'Weather delay in NYC hub',
      icon: CloudRain,
      timestamp: '2024-02-15T09:15:00',
      status: 'Active'
    },
    {
      id: 'DMT67890',
      type: 'Reroute',
      message: 'Parcel rerouted due to road closure',
      icon: RefreshCw,
      timestamp: '2024-02-14T14:30:00',
      status: 'Active'
    },
    {
      id: 'DMT54321',
      type: 'Delivered',
      message: 'Parcel successfully delivered',
      icon: AlertCircle,
      timestamp: '2024-02-13T11:45:00',
      status: 'Past'
    }
  ];

  const filteredNotifications = notifications.filter(
    (notification) =>
      notification.status === activeTab &&
      (filter === 'All' || notification.type === filter)
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-10 mt-10 px-80">
      <div className="bg-white dark:bg-slate-500 rounded-lg shadow-md p-6 px-10">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Notifications
        </h1>

        {/* Tabs and Filter */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            {['Active', 'Past'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded transition ${
                  activeTab === tab
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                {tab} Notifications
              </button>
            ))}
          </div>
          <div className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="appearance-none border rounded p-2 pr-8 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
            >
              <option value="All">All Notifications</option>
              <option value="Delay">Delays</option>
              <option value="Reroute">Reroutes</option>
            </select>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg flex items-center"
            >
              <div className="mr-4">
                <notification.icon className="text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-grow">
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {notification.type} Notification
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  {notification.message}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(notification.timestamp).toLocaleString()}
                </div>
              </div>
              <div className="bg-blue-100 dark:bg-blue-600 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                {notification.id}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notification;

/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import { Label, TextInput, Button } from "flowbite-react";
import { useState, useRef, useEffect } from "react";

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { Carousel } from "flowbite-react";
// import BackToTop from './../components/BackToTop';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useSelector } from 'react-redux';
import { Package, Truck, Bell, User } from 'lucide-react';

export default function Home() {
 // const pnrSection=useRef();
 const { currentUser } = useSelector((state) => state.user);
 const {theme}=useSelector((state)=>state.theme);
  const [pnr, setPnr] = useState('');
  const [success, setSuccess] = useState(false);
  const [travel, setTravel] = useState({});
  const [loading, setLoading] = useState(false);
  const pnrCardRef = useRef(); // Create a ref for the PnrCard section

  const handleChange = (e) => {
    setPnr(e.target.value);
  }

  const scrollUp=()=>{
    window.scrollTo({
        top:420,
        behavior:"smooth"
    })
}
    useEffect(()=>{
      AOS.init({duration:2000});
    },[]);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      setSuccess(false);
      const res = await fetch(`/api/pnr/${pnr}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (res.ok) {
        const data = await res.json();
        setSuccess(true);
        setLoading(false);
        setTravel(data.travel);

        // Scroll to the section where PnrCard is displayed

        scrollUp();
       
      } else {
        setLoading(false);
        console.log('Request failed with status:', res.status);
      }
    } catch (error) {
      setLoading(false);
      console.log('Error:', error);
    }
  };

   // Dummy data for upcoming deliveries
   const upcomingDeliveries = [
    { id: 'DMT12345', destination: 'New York, NY', expectedDelivery: '2024-02-15T14:30:00' },
    { id: 'DMT67890', destination: 'Los Angeles, CA', expectedDelivery: '2024-02-16T10:45:00' }
  ];

  return (
    <>
    <div>
   
      <div className="grid gap-0">
        
        <div className="w-[600px] md:w-[900px] mx-auto mt-12 h-60 sm:h-64 xl:h-80 2xl:h-full overflow-hidden">
  

        {/* ///// */}
          {/* Main Content */}
      <div className="bg-red rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Welcome to Dynamic Mail Transmission</h1>

        {/* Quick Parcel Tracking */}
       
        <div className="mb-6">
        <Label value="Your Parcel ID" className="mb-8" />
          <div className="flex items-center space-x-2 mb-4">
          
              <TextInput
                type='email'
                placeholder="Enter Parcel ID"
                id='email'
                // onChange={handleChange}
                className="flex-grow "
              />
           
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Track Parcel
            </button>
          </div>
        </div>

        {/* Delivery Type Options */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Choose Delivery Type</h2>
          <div className="grid grid-cols-4 gap-4">
            {['Fastest', 'Cheapest', 'Moderate', 'Deadline'].map((type) => (
              <button 
                key={type} 
                className="bg-blue-500 hover:bg-blue-700 p-4 rounded text-center"
              >
                {type} Delivery
              </button>
            ))}
          </div>
        </div>

         {/* Upcoming Deliveries */}
         <div>
          <h2 className="text-xl font-semibold mb-4">Upcoming Deliveries</h2>
          <div className="space-y-2">
            {upcomingDeliveries.map((delivery) => (
              <div 
                key={delivery.id} 
                className="flex justify-between items-center bg-gray-100 p-3 rounded"
              >
                <div>
                  <div className="font-medium text-red-600">Parcel ID: {delivery.id}</div>
                  <div className="text-gray-600">Destination: {delivery.destination}</div>
                </div>
                <div className="text-blue-600">
                  {new Date(delivery.expectedDelivery).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        </div>


        {/* ///// */}
     

  {/* <Carousel className="h-full">
    <img src="images/animation.png" alt="..." />
    <img src="images/republic.jpg" alt="..." />
    <img src="images/ses.jpg" alt="..." />
    <img src="images/slide-1.jpg" alt="..." />
    <img src="images/slide-6 (1).jpg" alt="..." />
    <img src="images/division.jpg" alt="..." />
    <img src="images/lhcbuild.jpeg" alt="..." />
  </Carousel> */}

</div>

     
       
      </div>
      <div className="min-h-screen mt-56">
      <div
  data-aos="fade-right"
  className={`mx-4 md:mx-10 my-3 p-14 shadow-lg rounded-lg text-black dark:text-white ${
    theme === "dark"
      ? "bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900"
      : "bg-gradient-to-r from-blue-400 via-purple-300 to-blue-400"
  }`}
>
          <h1 className="mb-8 h-6  text-3xl"> What is "ParcelPulse"?</h1>
          <p> "ParcelPulse" is a cutting-edge parcel delivery platform designed to optimize logistics through an efficient multi-level hub system. It ensures seamless delivery services between major hubs (airports, seaports), city hubs, and final destinations, catering to both speed and cost-effectiveness. </p>
        </div>
        <div
  data-aos="fade-right"
  className={`mx-4 md:mx-10 my-3 p-14 shadow-lg rounded-lg text-black dark:text-white ${
    theme === "dark"
      ? "bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900"
      : "bg-gradient-to-r from-blue-400 via-purple-300 to-blue-400"
  }`}
>
          <h2 className="mb-8 h-6  text-3xl">Who can use "ParcelPulse"?</h2>
          <p>
      ParcelPulse is accessible to both individual customers and businesses. With user-friendly tools, individuals can send parcels with ease, while businesses can integrate our platform to manage bulk logistics. Each user is uniquely identified through a secure registration process.
    </p>        </div>
        <div
  data-aos="fade-right"
  className={`mx-4 md:mx-10 my-3 p-14 shadow-lg rounded-lg text-black dark:text-white ${
    theme === "dark"
      ? "bg-gradient-to-r  from-slate-700 via-slate-800 to-slate-900"
      : "bg-gradient-to-r from-blue-400 via-purple-300 to-blue-400"
  }`}
>
          <h2 className="mb-8 h-6  text-3xl">Can users schedule parcel deliveries in advance?</h2>
          <p>
      Yes, users can book deliveries in advance through ParcelPulse. By selecting the "Book Parcel" option, customers can specify pickup and delivery locations, preferred dates, and delivery type (Fastest, Cheapest, Moderate, or Deadline-Based). Confirmation emails with tracking details are sent upon successful booking.
    </p>         
        </div>
        <div
  data-aos="fade-right"
  className={`mx-4 md:mx-10 my-3 p-14 shadow-lg rounded-lg text-black dark:text-white ${
    theme === "dark"
      ? "bg-gradient-to-r  from-slate-700 via-slate-800 to-slate-900"
      : "bg-gradient-to-r from-blue-400 via-purple-300 to-blue-400"
  }`}
>
          <h2 className="mb-8 h-6  text-3xl">Is the parcel delivery service free?</h2>
          <br /><br />
          <p> No, ParcelPulse operates on a tiered pricing model. Delivery charges depend on the delivery type chosen (Fastest, Cheapest, etc.), parcel size, and distance. Competitive rates ensure affordability, while the nominal fees contribute to system maintenance and service improvements.
          <br /><br />
       
        </p>
      </div>
      <div
  data-aos="fade-right"
  className={`mx-4 md:mx-10 my-3 p-14 shadow-lg rounded-lg text-black dark:text-white ${
    theme === "dark"
      ? "bg-gradient-to-r  from-slate-700 via-slate-800 to-slate-900"
      : "bg-gradient-to-r from-blue-400 via-purple-300 to-blue-400"
  }`}
>
        <h2 className="mb-8 h-6  text-3xl"> What are the available options for payment?</h2>
        <p> Customers can pay using various methods, including UPI, net banking, credit or debit cards, and integrated wallet systems. Businesses have the option of postpaid accounts for bulk shipments, enhancing their financial flexibility. </p>
      </div>
      <div
  data-aos="fade-right"
  className={`mx-4 md:mx-10 my-3 p-14 shadow-lg rounded-lg text-black dark:text-white ${
    theme === "dark"
      ? "bg-gradient-to-r  from-slate-700 via-slate-800 to-slate-900"
      : "bg-gradient-to-r from-blue-400 via-purple-300 to-blue-400"
  }`}
>
        <h2 className="mb-8 h-6  text-3xl">  How can users track their parcels?</h2>
        <p>
      Tracking parcels is effortless with ParcelPulse. By entering the unique parcel ID on the app or website, customers can view real-time updates on their parcel's location and status. Notifications and alerts provide live updates for delays, reroutes, or successful deliveries.
    </p>   
       </div>
    </div>

    </div>
  
</>
);
}

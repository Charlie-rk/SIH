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

  return (
    <>
    <div>
   
      <div className="grid gap-0">
        <div>
          
         
        </div>
        <div className="w-[600px] md:w-[900px] mx-auto mt-12 h-60 sm:h-64 xl:h-80 2xl:h-80 overflow-hidden">
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

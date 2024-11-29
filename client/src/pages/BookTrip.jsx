/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  Alert,
  Button,
  Label,
  Spinner,
  TextInput,
  FileInput,
  Modal
} from "flowbite-react";
import { Datepicker } from "flowbite-react";

// for parcel image
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app1 } from "../firebase";

// ----------

export default function BookTrip() {
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [type, setType] = useState("");
  const navigate = useNavigate();
  const filePickerRef = useRef();

  const [images, setImages] = useState({
    front: null,
    side1: null,
    side2: null,
    back: null,
  });
  const [imageUrls, setImageUrls] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const checkoutHandler = async (amount) => {
    // Fetch the Razorpay key and initiate the payment process
    console.log("request");
    // const response = await fetch("/api/pay/get-key");
    // console.log(response);

    const response = await fetch(`/api/pay/get-key`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const { key } = await response.json();
    // console.log(response);
    const razorOptions = {
      key: key,
      amount: amount * 100, // Amount in paise
      currency: "INR",
      name: "IIT BBS",
      description: "Travel cruiser",
      image:
        "https://upload.wikimedia.org/wikipedia/en/thumb/8/82/Indian_Institute_of_Technology_Bhubaneswar_Logo.svg/1200px-Indian_Institute_of_Technology_Bhubaneswar_Logo.svg.png",
      prefill: {
        name: "Rustam kumar",
        email: "rk@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#121212",
      },
      handler: function (response) {
        // Payment success callback
        console.log("Payment successful!", response);

        // Proceed with booking after successful payment
        handleSubmit();
      },
    };

    const razorpay = new window.Razorpay(razorOptions);
    razorpay.open();
  };

  useEffect(() => {
    // Initialize Razorpay script dynamically
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup function to remove the script after component unmounts
      document.body.removeChild(script);
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleDatepickerChange = (date) => {
    setSelectedDate(date);
  };

   // Function to handle file input changes
   const handleImageChange = (e) => {
    const { id } = e.target;
    setImages((prev) => ({ ...prev, [id]: e.target.files[0] }));
  };

   // Function to upload individual images
   const uploadImage = async (image, key) => {
    if (!image) return null;

    const storage = getStorage(app1);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, `parcel_images/${key}/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress((prev) => ({ ...prev, [key]: progress.toFixed(0) }));
        },
        (error) => {
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  };

  // Function to upload all images
  const uploadAllImages = async () => {
    setUploading(true);
    setUploadError(null);

    try {
      const urls = { ...imageUrls }; // Use existing URLs to avoid re-upload
      for (const [key, image] of Object.entries(images)) {
        if (image && !urls[key]) {
          urls[key] = await uploadImage(image, key);
        }
      }
      setImageUrls(urls);
      setFormData((prev) => ({ ...prev, parcelImages: urls }));
    } catch (error) {
      setUploadError("Failed to upload one or more images.");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (Object.values(images).some((img) => img !== null)) {
      uploadAllImages();
    }
  }, [images]);



 

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);

      const finalData = {
        ...formData,
        date: selectedDate,
        userId: currentUser._id,
        paymentType: type,
        imageUrl: imageUrls,
      };

      const res = await fetch("/api/bus/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });

      const data = await res.json();

      if (data.status !== 201) {
        setLoading(false);
        return setErrorMessage(data.message);
      }

      setLoading(false);
      if (res.ok) {
        navigate("/");
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };
  const openImagePreview = (url) => {
    setImagePreview(url);
    setIsModalOpen(true);
  };



  return (
    <div className="mt-10">
      <div className="grid gap-0">
        <div
          className="h-[400px] bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://gst-contracts.s3.ap-southeast-1.amazonaws.com/uploads/bcc/cms/asset/avatar/300473/banner_banner.jpg)",
          }}
        >
          <div className="flex flex-col gap justify-center items-cen h-ful bg-gray-900 bg-opacity-55">
            <div className="p-4  bg-gradient-to-r from-blue-700 via-white to-blue-900 rounded-lg text-black font-bold text-2xl">
              <div className="flex flex-col items-center">Book your xyz w.</div>
            </div>
          </div>
        </div>

        <div className="min-h-screen mt-20">
          <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
            <div className="flex-1">
              <Link to="/" className="font-bold dark:text-white text-4xl">
                <span className="px-2 py-1 bg-gradient-to-r  from-blue-700 via-white to-blue-800 rounded-lg text-black font-bold ">
                  Track your parcel
                </span>
                &nbsp; <br />
                <br /> SIH Hexacode
              </Link>
              <p className="text-sm mt-5">
                Welcome to our esteemed Services. Experience the convenience of
                our platform designed to cater to your fastest delivery needs.
                Please proceed by completing the form below.
              </p>
            </div>
            <div className="flex-1">
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div className="md:flex ">
                  <div className="mr-2">
                    <Label value="Source" />
                    <TextInput
                      type="text"
                      placeholder="My city"
                      id="source"
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label value="Destination" />
                    <TextInput
                      type="text"
                      placeholder="Shree jagannatha Temple"
                      id="destination"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div>
                  <Label value="To be decided let be xyz . " />
                  <TextInput
                    type="Number"
                    placeholder="0"
                    id="busNo"
                    onChange={handleChange}
                    min={0}
                  />
                </div>
                <div>
                  <Label value="Date" />
                  <Datepicker
                    id="datepicker"
                    name="selectedDate"
                    onChange={handleChange}
                    value={selectedDate}
                    onSelectedDateChanged={handleDatepickerChange}
                  />
                </div>

                {/* Parcel Image Upload */}
                <div>
            <Label value="Front Image" />
            <input
              type="file"
              id="front"
              accept="image/*"
              onChange={handleImageChange}
               className="bg-slate-400 rounded-lg"
            />
            {uploadProgress.front && <p>Uploading: {uploadProgress.front}%</p>}
          </div>
          <div>
            <Label value="Side1 Image" />
            <input
              type="file"
              id="side1"
              accept="image/*"
              onChange={handleImageChange}
               className="bg-slate-400 rounded-lg"
            />
            {uploadProgress.side1 && <p>Uploading: {uploadProgress.side1}%</p>}
          </div>
          <div>
            <Label value="Side2 Image" />
            <input
              type="file"
              id="side2"
              accept="image/*"
              onChange={handleImageChange}
               className="bg-slate-400 rounded-lg"
            />
            {uploadProgress.side2 && <p>Uploading: {uploadProgress.side2}%</p>}
          </div>
          <div>
            <Label value="Back Image"  />
            <input
              type="file"
              id="back"
              accept="image/*"
              onChange={handleImageChange}
              className="bg-slate-400 rounded-lg"
            />
            {uploadProgress.back && <p>Uploading: {uploadProgress.back}%</p>}
          </div>

          {Object.keys(imageUrls).length > 0 && (
            <div className="mt-2 grid grid-cols-2 gap-2">
              {Object.entries(imageUrls).map(([key, url]) => (
                <div key={key} onClick={() => openImagePreview(url)}>
                  <p>{key.toUpperCase()}:</p>
                  <img
                    src={url}
                    alt={key}
                    className="rounded-md w-32 h-32 object-cover cursor-pointer"
                  />
                </div>
              ))}
            </div>
          )}

          {uploadError && <Alert color="failure">{uploadError}</Alert>}


                <Button
                  gradientDuoTone="purpleToBlue"
                  type="button"
                  disabled={loading}
                  onClick={() => {
                    setType("PayNow");
                    checkoutHandler(50);
                  }}
                >
                  {loading ? (
                    <>
                      <Spinner size="sm" />
                      <span className="pl-3">Loading...</span>
                    </>
                  ) : (
                    "Pay Now"
                  )}
                </Button>
                <Button
                  gradientDuoTone="tealToLime"
                  type="submit"
                  disabled={loading}
                  onClick={() => {
                    setType("PayLater");
                  }}
                  outline
                >
                  {loading ? (
                    <>
                      <Spinner size="sm" />
                      <span className="pl-3">Loading...</span>
                    </>
                  ) : (
                    "Pay Later"
                  )}
                </Button>
              </form>

              {errorMessage && (
                <Alert className="mt-5" color="failure">
                  {errorMessage}
                </Alert>
              )}
            </div>
          </div>
        </div>
          {/* Modal for Image Preview */}
      <Modal show={isModalOpen} size="lg" onClose={() => setIsModalOpen(false)}>
        <Modal.Header>Image Preview</Modal.Header>
        <Modal.Body>
          <img src={imagePreview} alt="Preview" className="w-full" />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setIsModalOpen(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
      </div>
    </div>
  );
}

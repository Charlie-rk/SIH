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
  Modal,
} from "flowbite-react";
import { Datepicker } from "flowbite-react";
import { Truck, Clock, DollarSign, Calendar } from "lucide-react";
import { jsPDF } from "jspdf";
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

  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState(null);

  const generatePDF = (data) => {
    const doc = new jsPDF();
  
    // Header Section
    doc.setFillColor(230, 230, 230); // Light gray background for header
    doc.rect(0, 0, 210, 20, "F"); // Header background
    doc.setTextColor(0, 0, 0); // Black text
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("* ParcelPulse *", 105, 12, { align: "center" });
  
    // Section Title Styling Function
    const addSectionTitle = (title, yPosition) => {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(50, 50, 50); // Dark gray text
      doc.text(title, 15, yPosition);
      doc.setLineWidth(0.3);
      doc.line(15, yPosition + 2, 200, yPosition + 2); // Underline
    };
  
    // General Styling
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Black text
    doc.setFont("helvetica", "normal");
  
    // Parcel Details Section
    addSectionTitle("|| Parcel Booking Confirmation", 30);
    doc.text(`Parcel ID: ${data.parcelId}`, 15, 40);
  
    // Sender Details
    addSectionTitle("Sender Details", 50);
    doc.text(`1. Name: ${data.senderName}`, 20, 60);
    doc.text(`2. Contact: ${data.senderPhone}`, 20, 65);
    doc.text(`3. Address:`, 20, 70);
    doc.text(
      `   ${data.senderFlatNo}, ${data.senderLocality},`,
      25,
      75
    );
    doc.text(
      `   ${data.senderCity}, ${data.senderState} - ${data.senderPinCode}`,
      25,
      80
    );
  
    // Receiver Details
    addSectionTitle("Receiver Details", 90);
    doc.text(`1. Name: ${data.receiverName}`, 20, 100);
    doc.text(`2. Contact: ${data.receiverPhone}`, 20, 105);
    doc.text(`3. Address:`, 20, 110);
    doc.text(
      `   ${data.receiverFlatNo}, ${data.receiverLocality},`,
      25,
      115
    );
    doc.text(
      `   ${data.receiverCity}, ${data.receiverState} - ${data.receiverPinCode}`,
      25,
      120
    );
  
    // Parcel Details Section
    addSectionTitle("Parcel Details", 130);
    doc.text(`1. Weight: ${data.parcelWeight} kg`, 20, 140);
    doc.text(`2. Dimensions: ${data.parcelLength}x${data.parcelWidth}x${data.parcelHeight} cm`, 20, 145);
    doc.text(`3. Shipping Date: ${data.date}`, 20, 150);
    doc.text(`4. Delivery Option: ${data.deliveryOption.type}`, 20, 155);
  
    // Delivery Option
    addSectionTitle("Delivery Option", 165);
    doc.text(`1. Type: ${data.deliveryOption.type}`, 20, 175);
    doc.text(`2. Description: ${data.deliveryOption.description}`, 20, 180);
    doc.text(`3. Cost: ${data.deliveryOption.cost}`, 20, 185);
    doc.text(`4. Estimated Time: ${data.deliveryOption.estimatedTime}`, 20, 190);
  
    // Payment Details
    addSectionTitle("Payment Details", 200);
    doc.text(`1. Payment Type: ${data.paymentType}`, 20, 210);
  
    // Footer Section with Date, Time, and Copyright
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();
    const formattedTime = currentDate.toLocaleTimeString();
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100); // Grey text
    doc.text(`Generated on: ${formattedDate} at ${formattedTime}`, 105, 280, { align: "center" });
    doc.text("© 2024 ParcelPulse. All rights reserved.", 105, 285, { align: "center" });
  
    // Save PDF
    doc.save(`Parcel_${data.parcelId}.pdf`);
  };
  

  const deliveryOptions = [
    {
      type: "Fastest",
      icon: Truck,
      description: "Prioritize transit time",
      estimatedTime: "2-3 Days",
      cost: 50.0,
    },
    {
      type: "Cheapest",
      icon: DollarSign,
      description: "Minimize shipping cost",
      estimatedTime: "7-10 Days",
      cost: 15.0,
    },
    {
      type: "Moderate",
      icon: Clock,
      description: "Balance between cost and time",
      estimatedTime: "4-5 Days",
      cost: 25.0,
    },
    {
      type: "Deadline",
      icon: Calendar,
      description: "Choose specific delivery time",
      estimatedTime: "Custom",
      cost: 75.0,
    },
  ];

  const handleDeliveryOptionConfirm = () => {
    setIsDeliveryModalOpen(false);
  };

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

  // const checkoutHandler = async (amount) => {
  //   // Fetch the Razorpay key and initiate the payment process
  //   console.log("request");
  //   // const response = await fetch("/api/pay/get-key");
  //   // console.log(response);

  //   const response = await fetch(`/api/pay/get-key`, {
  //     method: "GET",
  //     headers: { "Content-Type": "application/json" },
  //   });
  //   const { key } = await response.json();
  //   // console.log(response);
  //   const razorOptions = {
  //     key: key,
  //     amount: amount * 100, // Amount in paise
  //     currency: "INR",
  //     name: "IIT BBS",
  //     description: "Travel cruiser",
  //     image:
  //       "https://upload.wikimedia.org/wikipedia/en/thumb/8/82/Indian_Institute_of_Technology_Bhubaneswar_Logo.svg/1200px-Indian_Institute_of_Technology_Bhubaneswar_Logo.svg.png",
  //     prefill: {
  //       name: "Rustam kumar",
  //       email: "rk@example.com",
  //       contact: "9999999999",
  //     },
  //     theme: {
  //       color: "#121212",
  //     },
  //     handler: function (response) {
  //       // Payment success callback
  //       console.log("Payment successful!", response);

  //       // Proceed with booking after successful payment
  //       handleSubmit();
  //     },
  //   };

  //   const razorpay = new window.Razorpay(razorOptions);
  //   razorpay.open();
  // };

  // useEffect(() => {
  //   // Initialize Razorpay script dynamically
  //   const script = document.createElement("script");
  //   script.src = "https://checkout.razorpay.com/v1/checkout.js";
  //   script.async = true;
  //   document.body.appendChild(script);

  //   return () => {
  //     // Cleanup function to remove the script after component unmounts
  //     document.body.removeChild(script);
  //   };
  // }, []);

  const handleChange = (e) => {
    console.log("Form Data ---");
    console.log(formData);
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
          setUploadProgress((prev) => ({
            ...prev,
            [key]: progress.toFixed(0),
          }));
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
    console.log("Form Submitted ....");
    try {
      console.log("Entereed ----");
      setLoading(true);
      setErrorMessage(null);

      console.log(formData);
      console.log("Seleceted delievery options  -----");
      console.log(selectedDeliveryOption);
      console.log("HII 0 ");
      const finalData = {
        ...formData,
        date: selectedDate,
        // userId: currentUser._id,
        paymentType: type,
        imageUrl: imageUrls,
        deliveryOption: selectedDeliveryOption,
      };

      console.log("Hii 1");
      console.log(formData);

      // generatePDF({ ...finalData, parcelId: 123456 });

      // return;

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
        generatePDF({ ...finalData, parcelId: data.parcelId });
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
          className="h-[40px] bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://gst-contracts.s3.ap-southeast-1.amazonaws.com/uploads/bcc/cms/asset/avatar/300473/banner_banner.jpg)",
          }}
        >
          {/* <div className="flex flex-col gap justify-center items-center h-full bg-gray-900 bg-opacity-50 dark:bg-gray-700 dark:bg-opacity-60">
            <div className="p-4 bg-gradient-to-r from-blue-700 via-white to-blue-900 rounded-lg text-black font-bold text-2xl dark:text-white">
              <div className="flex flex-col items-center">Book your xyz w.</div>
            </div>
          </div> */}
        </div>

        <div className="min-h-screen mt-20 mb-20">
          <div className="max-w-4xl mx-auto p-6 bg-slate-300 rounded-lg shadow-md dark:bg-gray-500">
            <form className="grid grid-cols-2 gap-6" onSubmit={handleSubmit}>
              {/* Source Details (Left Half) */}
              <div className="space-y-4 border-r-2 pr-6 dark:border-gray-600">
                <h2 className="text-xl font-bold mb-4 text-black dark:text-slate-200">
                  Sender Details
                </h2>
                <div>
                  <Label value="Full Name" />
                  <TextInput
                    type="text"
                    placeholder="Sender's Name"
                    id="senderName"
                    onChange={handleChange}
                    required
                    className="dark:bg-gray-700 dark:text-white rounded-lg"
                  />
                </div>
                <div>
                  <Label value="Phone Number" />
                  <TextInput
                    type="tel"
                    placeholder="Contact no."
                    id="senderPhone"
                    onChange={handleChange}
                    pattern="[0-9]{10}"
                    required
                    className="dark:bg-gray-700 dark:text-white rounded-lg"
                  />
                </div>
                <div>
                  <Label value="Flat/House No." />
                  <TextInput
                    type="text"
                    placeholder="Flat/House No"
                    id="senderFlatNo"
                    onChange={handleChange}
                    className="dark:bg-gray-700 dark:text-white rounded-lg"
                  />
                </div>
                <div>
                  <Label value="Street/Locality" />
                  <TextInput
                    type="text"
                    placeholder="Street/Locality"
                    id="senderLocality"
                    onChange={handleChange}
                    required
                    className="dark:bg-gray-700 dark:text-white rounded-lg"
                  />
                </div>
                <div>
                  <Label value="City" />
                  <TextInput
                    type="text"
                    placeholder="City"
                    id="senderCity"
                    onChange={handleChange}
                    required
                    className="dark:bg-gray-700 dark:text-white rounded-lg"
                  />
                </div>
                <div>
                  <Label value="State" />
                  <TextInput
                    type="text"
                    placeholder="State"
                    id="senderState"
                    onChange={handleChange}
                    required
                    className="dark:bg-gray-700 dark:text-white rounded-lg"
                  />
                </div>
                <div>
                  <Label value="PIN Code" />
                  <TextInput
                    type="text"
                    placeholder="PIN Code"
                    id="senderPinCode"
                    onChange={handleChange}
                    pattern="[0-9]{6}"
                    required
                    className="dark:bg-gray-700 dark:text-white rounded-lg"
                  />
                </div>
              </div>

              {/* Destination Details (Right Half) */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold mb-4 text-black dark:text-slate-200">
                  Receiver Details
                </h2>
                <div>
                  <Label value="Full Name" />
                  <TextInput
                    type="text"
                    placeholder="Receiver's Name"
                    id="receiverName"
                    onChange={handleChange}
                    required
                    className="dark:bg-gray-700 dark:text-white rounded-lg"
                  />
                </div>
                <div>
                  <Label value="Phone Number" />
                  <TextInput
                    type="tel"
                    placeholder="Contact No."
                    id="receiverPhone"
                    onChange={handleChange}
                    pattern="[0-9]{10}"
                    required
                    className="dark:bg-gray-700 dark:text-white rounded-lg"
                  />
                </div>
                <div>
                  <Label value="Flat/House No." />
                  <TextInput
                    type="text"
                    placeholder="Flat/House No."
                    id="receiverFlatNo"
                    onChange={handleChange}
                    className="dark:bg-gray-700 dark:text-white rounded-lg"
                  />
                </div>
                <div>
                  <Label value="Street/Locality" />
                  <TextInput
                    type="text"
                    placeholder="Street/Locality"
                    id="receiverLocality"
                    onChange={handleChange}
                    required
                    className="dark:bg-gray-700 dark:text-white rounded-lg"
                  />
                </div>
                <div>
                  <Label value="City" />
                  <TextInput
                    type="text"
                    placeholder="City"
                    id="receiverCity"
                    onChange={handleChange}
                    required
                    className="dark:bg-gray-700 dark:text-white rounded-lg"
                  />
                </div>
                <div>
                  <Label value="State" />
                  <TextInput
                    type="text"
                    placeholder="State"
                    id="receiverState"
                    onChange={handleChange}
                    required
                    className="dark:bg-gray-700 dark:text-white rounded-lg"
                  />
                </div>
                <div>
                  <Label value="PIN Code" />
                  <TextInput
                    type="text"
                    placeholder="PIN Code"
                    id="receiverPinCode"
                    onChange={handleChange}
                    pattern="[0-9]{6}"
                    required
                    className="dark:bg-gray-700 dark:text-white rounded-lg"
                  />
                </div>
              </div>

              {/* Parcel Details Section */}
              <div className="col-span-2 mt-6 space-y-4">
                <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  Parcel Details
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label value="Parcel Weight (kg)" />
                    <TextInput
                      type="number"
                      placeholder="Parcel Weight (kg)"
                      id="parcelWeight"
                      onChange={handleChange}
                      step="0.1"
                      min="0"
                      required
                      className="dark:bg-gray-700 dark:text-white rounded-lg"
                    />
                  </div>
                  <div>
                    <Label value="Parcel Dimensions (L x W x H in cm)" />
                    <div className="flex space-x-2">
                      <TextInput
                        type="number"
                        placeholder="Length"
                        id="parcelLength"
                        onChange={handleChange}
                        min="0"
                        className="flex-1 dark:bg-gray-700 dark:text-white rounded-lg"
                      />
                      <TextInput
                        type="number"
                        placeholder="Width"
                        id="parcelWidth"
                        onChange={handleChange}
                        min="0"
                        className="flex-1 dark:bg-gray-700 dark:text-white rounded-lg"
                      />
                      <TextInput
                        type="number"
                        placeholder="Height"
                        id="parcelHeight"
                        onChange={handleChange}
                        min="0"
                        className="flex-1 dark:bg-gray-700 dark:text-white rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label value="Shipping Date" />
                  <Datepicker
                    id="shippingDate"
                    name="shippingDate"
                    onChange={handleChange}
                    value={selectedDate}
                    onSelectedDateChanged={handleDatepickerChange}
                    className="dark:bg-gray-700 dark:text-white rounded-lg pr-96"
                  />
                </div>

                {/* Delivery Option Button */}
                <div>
                  <Button
                    gradientDuoTone="purpleToBlue"
                    variant="contained"
                    color="primary"
                    onClick={() => setIsDeliveryModalOpen(true)}
                  >
                    Select Delivery Option
                  </Button>
                  {selectedDeliveryOption && (
                    <div className="mt-2">
                      <p>
                        <strong className="text-black">Selected Option:</strong>{" "}
                        {selectedDeliveryOption.type} ($
                        {selectedDeliveryOption.cost.toFixed(2)})
                      </p>
                    </div>
                  )}
                </div>

                {/* Image Upload Section */}
                <div>
                  <Label value="Front Image" />
                  <input
                    type="file"
                    id="front"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="bg-gray-400 rounded-lg dark:bg-gray-400 ml-4"
                  />
                  {uploadProgress.front && (
                    <p>Uploading: {uploadProgress.front}%</p>
                  )}
                </div>
                <div>
                  <Label value="Side1 Image" />
                  <input
                    type="file"
                    id="side1"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="bg-gray-400 rounded-lg ml-4 dark:bg-gray-400"
                  />
                  {uploadProgress.side1 && (
                    <p>Uploading: {uploadProgress.side1}%</p>
                  )}
                </div>
                <div>
                  <Label value="Side2 Image" />
                  <input
                    type="file"
                    id="side2"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="bg-gray-400 ml-4 rounded-lg dark:bg-gray-400"
                  />
                  {uploadProgress.side2 && (
                    <p>Uploading: {uploadProgress.side2}%</p>
                  )}
                </div>
                <div>
                  <Label value="Back Image" />
                  <input
                    type="file"
                    id="top"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="bg-gray-400 ml-5 rounded-lg dark:bg-gray-400"
                  />
                  {uploadProgress.top && (
                    <p>Uploading: {uploadProgress.top}%</p>
                  )}
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

                {/* Submit Button */}
                {/* Payment Buttons */}
                <div className="col-span-1 flex justify-between mt-6">
                  <Button
                    gradientDuoTone="purpleToBlue"
                    type="submit"
                    disabled={loading}
                    onClick={handleSubmit}
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" />
                        <span className="pl-3">Loading...</span>
                      </>
                    ) : (
                      "Submit"
                    )}
                  </Button>
                </div>

                {/* Delivery Options Modal */}
                <Modal
                  show={isDeliveryModalOpen}
                  onClose={() => setIsDeliveryModalOpen(false)}
                  size="lg"
                >
                  <Modal.Header>
                    <h1
                      id="delivery-options-title"
                      className="text-2xl font-bold text-blue-900"
                    >
                      Choose Your Delivery Option
                    </h1>
                  </Modal.Header>
                  <Modal.Body>
                    <div className="grid md:grid-cols-2 gap-4">
                      {deliveryOptions.map((option) => (
                        <button
                          key={option.type}
                          onClick={() => setSelectedDeliveryOption(option)}
                          className={`p-4 rounded-lg border-2 text-left w-full bg-slate-200
          ${
            selectedDeliveryOption?.type === option.type
              ? "border-blue-500 bg-blue-200"
              : "border-y-slate-300 hover:bg-gray-300"
          }`}
                        >
                          <div className="flex items-center mb-2">
                            <option.icon className="mr-2 text-blue-600" />
                            <p className="font-semibold">
                              {option.type} Delivery
                            </p>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {option.description}
                          </p>
                          <div className="flex justify-between">
                            <span>Time: {option.estimatedTime}</span>
                            <span className="font-medium">
                              ${option.cost.toFixed(2)}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <div className="mt-6 flex justify-end w-full ">
                      <Button
                        outline
                        gradientDuoTone="purpleToBlue"
                        onClick={handleDeliveryOptionConfirm}
                      >
                        Confirm
                      </Button>
                    </div>
                  </Modal.Footer>
                </Modal>
              </div>
            </form>
          </div>
        </div>
        {/* Modal for Image Preview */}
        <Modal
          show={isModalOpen}
          size="lg"
          onClose={() => setIsModalOpen(false)}
        >
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

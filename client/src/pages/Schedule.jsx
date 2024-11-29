/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { storage2 } from "../firebase";
import { Button, FileInput } from "flowbite-react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

// Icons
import { MapPin, Clock, Sun } from "lucide-react";

export default function Schedule() {
  const [parcelId, setParcelId] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  const [imageUpload, setImageUpload] = useState(null);
  const [resumeUrls, setResumeUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const imagesListRef = ref(storage2, "images/");
  const MySwal = withReactContent(Swal);

  // Dummy tracking data
  const parcelData = {
    id: "DMT12345",
    status: "In Transit",
    currentLocation: "NYC Airport",
    estimatedArrival: "2024-02-15T14:30:00",
    route: [
      { location: "San Francisco", status: "Departed", time: "2024-02-13T10:00:00" },
      { location: "Denver Hub", status: "In Transit", time: "2024-02-14T15:45:00" },
      { location: "NYC Airport", status: "Current", time: "2024-02-15T09:15:00" },
      { location: "Final Destination", status: "Pending", time: "2024-02-15T14:30:00" },
      { location: "Final Destination", status: "Pending", time: "2024-02-15T14:30:00" },
      { location: "Final Destination", status: "Pending", time: "2024-02-15T14:30:00" },
    ],
  };

  const uploadFile = async () => {
    if (imageUpload == null) {
      MySwal.fire({
        icon: "error",
        title: "Please select a file.",
        text: "File is missing.",
      });
      return;
    }
    setLoading(true);
    const imageRef = ref(storage2, `images/${imageUpload.name}`);
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setLoading(false);
        setResumeUrls((prev) => [...prev, url]);
      });
    });
  };

  useEffect(() => {
    listAll(imagesListRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setResumeUrls((prev) => [...prev, url]);
        });
      });
    });
  }, []);

  return (
    <div className="mt-32 dark:bg-slat-900 dark:text-white">
      {currentUser && currentUser.role === "Admin" && (
        <div className="w-[650px] mx-auto mb-8">
          <h4 className="text-lg font-semibold">Upload Schedule</h4>
          <FileInput
            id="file-upload"
            onChange={(e) => setImageUpload(e.target.files[0])}
            name="pdfFile"
            required
          />
          <Button
            onClick={uploadFile}
            gradientDuoTone="purpleToBlue"
            type="submit"
            outline
            className="w-full mt-6"
            disabled={loading}
          >
            {loading ? "Uploading" : "Submit"}
          </Button>
        </div>
      )}
      <div className="min-h-screen bg-slate-200 dark:bg-gray-800 p-4 px-48">
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6">Parcel Tracking</h1>
          <div className="flex items-center space-x-2 mb-6">
            <input
              type="text"
              value={parcelId}
              onChange={(e) => setParcelId(e.target.value)}
              placeholder="Enter Parcel ID"
              className="flex-grow border dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded p-2"
            />
            <Button color="blue" className="px-4 py-2">
              Track Parcel
            </Button>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded mb-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Current Status</h2>
                  <span className="bg-blue-200 dark:bg-blue-600 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                    {parcelData.status}
                  </span>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center">
                    <MapPin className="mr-2 text-blue-600" />
                    <span>Location: {parcelData.currentLocation}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-2 text-green-600" />
                    <span>
                      Estimated Arrival: {new Date(parcelData.estimatedArrival).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Sun className="mr-2 text-yellow-600" />
                    <span>Weather: Clear</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Parcel Journey</h3>
                <div className="border-l-4 border-blue-500 pl-8 h-96 overflow-y-scroll rounded-md  bg-slate-400 py-4 pr-5 ,">
                  {parcelData.route.map((stop, index) => (
                    <div key={index} className="mb-4 relative">
                      <div
                        className={`absolute -left-[27px] top-1 w-4 h-4 rounded-full ${
                          stop.status === "Current"
                            ? "bg-blue-500"
                            : stop.status === "Departed"
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      ></div>
                      <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded">
                        <div className="font-medium">{stop.location}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {stop.status}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(stop.time).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <img
                src="https://storage.googleapis.com/gweb-uniblog-publish-prod/images/google_maps_helpful_hero_1.width-1300.jpg"
                alt="Parcel Route Map"
                className="w-full rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

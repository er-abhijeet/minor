import { useState, useRef } from 'react';
import Webcam from "react-webcam";
import { Camera, Clock, ClipboardList, User } from "lucide-react";

function App() {
  const [preview, setPreview] = useState(null);
  const webcamRef = useRef(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false); // Track camera visibility

  // Function to capture an image from the webcam
  const capturePhoto = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setPreview(imageSrc);
    setIsCameraOpen(false); // Close webcam after capturing
  };

  // Function to retake the image
  const handleRetake = () => {
    setPreview(null);
    setIsCameraOpen(true); // Reopen webcam
  };

  // Function to confirm and send image to API
  const handleConfirm = async () => {
    if (!preview) return;

    try {
      const response = await fetch("https://your-api-endpoint.com/upload", {
        method: "POST",
        body: JSON.stringify({ image: preview }), // Send base64 image
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log("API Response:", data);
      alert("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image.");
    }

    // Clear the preview after submission
    handleRetake();
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      {/* Quick Actions */}
      <div className="mt-4">
        <h2 className="text-lg font-semibold">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4 mt-2">
          {/* Open Camera Button */}
          <button 
            onClick={() => setIsCameraOpen(true)} 
            className="cursor-pointer bg-green-100 p-4 flex flex-col items-center rounded-lg shadow-md"
          >
            📸
            <p className="mt-2">Scan Food</p>
          </button>
          <div className="bg-blue-100 p-4 flex flex-col items-center rounded-lg shadow-md">
            <ClipboardList className="text-blue-600" />
            <p className="mt-2">View History</p>
          </div>
        </div>
      </div>

      {/* Camera View */}
      {isCameraOpen && (
        <div className="mt-4 bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="w-full h-64 rounded-lg shadow-md"
          />
          <button 
            onClick={capturePhoto} 
            className="px-4 py-2 bg-blue-500 text-white rounded-lg mt-2"
          >
            Capture
          </button>
        </div>
      )}

      {/* Preview & Actions */}
      {preview && (
        <div className="mt-4 bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
          <img src={preview} alt="Preview" className="w-40 h-40 object-cover rounded-md" />
          <div className="flex gap-4 mt-4">
            <button onClick={handleRetake} className="px-4 py-2 bg-red-500 text-white rounded-lg">
              Retake
            </button>
            <button onClick={handleConfirm} className="px-4 py-2 bg-blue-500 text-white rounded-lg">
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

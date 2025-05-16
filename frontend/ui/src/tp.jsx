import { useState, useRef, useEffect } from 'react';
import Webcam from "react-webcam";

function CameraComponent() {
  const webcamRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  // Request Camera Permissions
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(() => setHasPermission(true))
      .catch(() => setHasPermission(false));
  }, []);

  // Capture image
  const capturePhoto = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setPreview(imageSrc);
    setIsCameraOpen(false); // Close camera after capture
  };

  // Retake image
  const handleRetake = () => {
    setPreview(null);
    setIsCameraOpen(true);
  };

  if (hasPermission === false) {
    return <p className="text-red-500">Camera access denied. Please enable it in browser settings.</p>;
  }

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <button onClick={() => setIsCameraOpen(true)} className="bg-green-500 text-white p-2 rounded">
        Open Camera
      </button>

      {isCameraOpen && hasPermission && (
        <div className="mt-4 bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
          <Webcam ref={webcamRef} screenshotFormat="image/jpeg" className="w-full h-64 rounded-lg shadow-md" />
          <button onClick={capturePhoto} className="px-4 py-2 bg-blue-500 text-white rounded-lg mt-2">
            Capture
          </button>
        </div>
      )}

      {preview && (
        <div className="mt-4 bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
          <img src={preview} alt="Preview" className="w-40 h-40 object-cover rounded-md" />
          <div className="flex gap-4 mt-4">
            <button onClick={handleRetake} className="px-4 py-2 bg-red-500 text-white rounded-lg">
              Retake
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CameraComponent;

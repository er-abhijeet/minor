// import React from 'react'
import { useState  } from "react";
import Webcam from "react-webcam";

function CameraView(props) {
const [cameraType, setCameraType] = useState("environment"); 
  return (

    <>
      <div className="mt-4 bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
        <Webcam
          ref={props.webcamRef}
          screenshotFormat="image/jpeg"
          className="w-full h-64 rounded-lg shadow-md"
          videoConstraints={{
            facingMode: cameraType,
          }}
        />
        <button
          onClick={props.capturePhoto}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg mt-2"
        >
          Capture
        </button>
        <button
          onClick={() =>
            setCameraType((prev) => (prev === "user" ? "environment" : "user"))
          }
          className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded-lg"
        >
          Toggle Camera
        </button>
      </div>
    </>
  );
}

export default CameraView;

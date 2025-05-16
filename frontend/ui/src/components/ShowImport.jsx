// import React from 'react'

import Preview from "./Preview";

function ShowImport(props) {
  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
          <p className="text-lg font-semibold mb-4">Choose Import Option</p>
          <button
            onClick={() => {
              props.setShowImportDialog(false);
              props.setIsCameraOpen(true); // Open camera for taking a picture
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg mb-2"
          >
            Click a Picture
          </button>

          <input
            type="file"
            accept="image/*"
            onChange={props.handleFileChange}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg mb-2"
          />

          {props.preview && (
            <Preview
              handleConfirm={props.handleConfirm}
              handleRetake={props.handleRetake}
              forPreview={props.forPreview}
            />
          )}

          <button
            onClick={() => props.setShowImportDialog(false)}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}

export default ShowImport;

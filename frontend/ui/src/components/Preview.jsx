// import React from 'react'

function Preview(props) {
  return (
    <>
      <div className="mt-2 flex flex-col items-center">
        <img
          src={props.forPreview}
          alt="Preview"
          className="w-40 h-40 object-cover rounded-md mb-2"
        />
        <div className="flex gap-4">
          <button
            onClick={props.handleRetake}
            className="px-4 py-2 bg-red-500 text-white rounded-lg"
          >
            Retake
          </button>
          <button
            onClick={props.handleConfirm}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Submit
          </button>
        </div>
      </div>
    </>
  );
}

export default Preview;

// import React from 'react'
import {   ClipboardList , GlassWater} from "lucide-react";


function QuickActions(props) {
    return (
        <>
        <div className="mt-4">
        <h2 className="text-lg font-semibold">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4 mt-2">
          {/* Open Camera Button */}
          <button
            onClick={() => props.setShowImportDialog(true)} // Open import dialog
            className="cursor-pointer bg-green-100 p-4 flex flex-col items-center rounded-lg shadow-md"
          >
            📸
            <p className="mt-2">Scan Food</p>
          </button>
          <div onClick={()=>props.setWaterInput(true)} className="bg-blue-100 p-4 flex flex-col items-center rounded-lg shadow-md">
            <GlassWater className="text-blue-600" />
            <p className="mt-2">Add Water</p>
          </div>
        </div>
      </div>
        </>
    )
}

export default QuickActions

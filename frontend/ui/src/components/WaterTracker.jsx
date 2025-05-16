import { useState } from "react";
import { GlassWater, Plus, Minus } from "lucide-react";

const WaterTracker = (props) => {
  const maxGlasses = 8;

  const addGlass = () => {
    if (props.glasses < maxGlasses) {
      props.setGlasses(props.glasses + 1);
    }
  };

  const removeGlass = () => {
    if (props.glasses > 0) {
      props.setGlasses(props.glasses - 1);
    }
  };

  return (
    <div className="cen mt-6 p-6 bg-blue-100 rounded-lg shadow-md w-80 text-center">
      <h2 className="text-xl font-bold text-blue-800 mb-3">Daily Water Intake</h2>

      {/* Glass Display */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {[...Array(maxGlasses)].map((_, index) => (
          <GlassWater
            key={index}
            className={`w-10 h-10 transition-all ${
              index < props.glasses ? "text-blue-500 fill-blue-300" : "text-gray-300"
            }`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-300 rounded-full h-4 mb-4">
        <div
          className="bg-blue-500 h-4 rounded-full transition-all"
          style={{ width: `${(props.glasses / maxGlasses) * 100}%` }}
        ></div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <button
          onClick={removeGlass}
          className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-1 disabled:opacity-50"
          disabled={props.glasses === 0}
        >
          <Minus size={18} />
          Remove
        </button>
        <button
          onClick={addGlass}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-1 disabled:opacity-50"
          disabled={props.glasses === maxGlasses}
        >
          <Plus size={18} />
          Add Glass
        </button>
      </div>

      {/* Encouragement Message */}
      <p className="mt-3 text-blue-800 font-medium">
        {props.glasses === 0
          ? "Start drinking water! 💧"
          : props.glasses < maxGlasses
          ? "Keep going, stay hydrated! 🚰"
          : "Great job! You've reached your goal! 🎉"}
      </p>
      <button
          onClick={()=> props.setWaterInput(false)}
          className=" cen  mt-2 bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-1 disabled:opacity-50"
        >
          Done
        </button>
    </div>
  );
};

export default WaterTracker;

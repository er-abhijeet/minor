import React from "react";

const FoodConfirmation = ({ msg, onAdd, onDiscard }) => {
    const handleAdd= ()=>{
        const foodData = {
            food: selectedFood,
            quantity,
            unit,
          };
          onAdd(foodData);
    }
  return (
    <div className=" mt-3 p-4 bg-white shadow-md rounded-lg text-center">
      <h2 className="text-lg font-semibold mb-2">Confirm Food Item</h2>
      <p className="text-gray-700 mb-3">
        {msg}
      </p>
      <p className="mb-4">Do you want to add it?</p>

      <div className="flex justify-center gap-4">
        <button
          onClick={onAdd}
          className="px-4 py-2 bg-green-500 text-white rounded-lg"
        >
          ✅ Add
        </button>
        <button
          onClick={onDiscard}
          className="px-4 py-2 bg-red-500 text-white rounded-lg"
        >
          ❌ Discard
        </button>
      </div>
    </div>
  );
};

export default FoodConfirmation;

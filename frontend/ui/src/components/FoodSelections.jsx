import { useState } from "react";

const FoodSelection = ({ foodItems, onSubmit }) => {
  const [selectedFood, setSelectedFood] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState("grams");

  const units = ["ml", "grams", "cups", "tablespoon"];

  const handleSubmit = () => {
    if (!selectedFood || quantity <= 0) {
      alert("Please select a food item and enter a valid quantity.");
      return;
    }

    // Send data to parent component or API
    const foodData = {
      food: selectedFood,
      quantity,
      unit,
    };

    onSubmit(foodData); // Call parent function with data
  };

  return (
    <div className="mt-3 p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-lg font-semibold mb-2">Select Food Item</h2>

      {/* Radio Buttons for Food Items */}
      <div className="mb-3">
        {foodItems.map((food, index) => (
          <label key={index} className="flex items-center space-x-2">
            <input
              type="radio"
              name="foodItem"
              value={food}
              checked={selectedFood === food}
              onChange={() => setSelectedFood(food)}
            />
            <span>{food}</span>
          </label>
        ))}
      </div>

      {/* Quantity Input */}
      <div className="mb-3">
        <label className="block text-sm font-medium">Quantity</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full p-2 border rounded-md"
          min="1"
        />
      </div>

      {/* Unit Dropdown */}
      <div className="mb-3">
        <label className="block text-sm font-medium">Unit</label>
        <select
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          {units.map((unit, index) => (
            <option key={index} value={unit}>
              {unit}
            </option>
          ))}
        </select>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="w-full bg-blue-500 text-white py-2 rounded-lg mt-3"
      >
        Submit
      </button>
    </div>
  );
};

export default FoodSelection;

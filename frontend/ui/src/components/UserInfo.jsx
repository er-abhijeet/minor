import { useState ,useContext} from "react";
import UserContext from "@/context/UserContext";


export default function UserInfo({ userId, setTargetCals, targetCals, setInfoPreview }) {
  // const ip="localhost"
  const { ipad } = useContext(UserContext);
  const ip=ipad; // for backend
  const [formData, setFormData] = useState({
    height: "",
    weight: "",
    age: "",
    gender: "",
    activity: "",
  });

  const [goal, setGoal] = useState(null);
  const [reset, setReset] = useState(true);

  const handleChange = (e) => {
    if (e.target.name === "goal") setGoal(e.target.value);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateCalories = async () => {
    const url = `https://do-calculate.com/api/calculate-calories`;
    console.log(formData);

    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      const calculatedCals = data.result.dailyCalories[goal];

      setTargetCals(calculatedCals);
      setReset(false);

      // ✅ Save to database
      await fetch(`${ip}/user/${userId}/targetCalories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetCalories: calculatedCals }),
      });

      // alert("Target calories saved!");
    console.log("here12");

      console.log(typeof(formData));
      console.log(formData);
      await fetch(`${ip}/changeinfo/?userId=${userId}`,{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({data:formData}),
      })


    } catch (error) {
      console.error("Error calculating calories:", error);
      alert("Failed to calculate target calories.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="mt-4 p-4 bg-white shadow-md rounded-lg">
        <h2 className="text-lg font-semibold">Calorie Calculator</h2>
        {reset && (
          <div>
            <input type="number" name="height" placeholder="Height (cm)" value={formData.height} onChange={handleChange} className="mt-2 p-2 border rounded w-full" />
            <input type="number" name="weight" placeholder="Weight (kg)" value={formData.weight} onChange={handleChange} className="mt-2 p-2 border rounded w-full" />
            <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} className="mt-2 p-2 border rounded w-full" />
            <select name="gender" value={formData.gender} onChange={handleChange} className="mt-2 p-2 border rounded w-full">
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <select name="activity" value={formData.activity} onChange={handleChange} className="mt-2 p-2 border rounded w-full">
              <option value="">Select Activity Level</option>
              <option value="sedentary">Sedentary</option>
              <option value="lightlyActive">Light Activity</option>
              <option value="moderatelyActive">Moderate Activity</option>
              <option value="active">Active</option>
              <option value="veryActive">Very Active</option>
            </select>
            <select name="goal" value={goal} onChange={handleChange} className="mt-2 p-2 border rounded w-full">
              <option value="">Select Your Goal</option>
              <option value="extremeGain">Extreme Gain</option>
              <option value="extremeLoss">Extreme Loss</option>
              <option value="gain">Gain</option>
              <option value="lose">Lose</option>
              <option value="maintain">Maintain</option>
              <option value="mildGain">Mild Gain</option>
              <option value="mildLoss">Mild Loss</option>
            </select>
            <button onClick={calculateCalories} className="mt-2 p-2 bg-blue-500 text-white rounded w-full">Calculate</button>
          </div>
        )}
        <p className="mt-2 text-gray-700">Target Calories: {targetCals} kcal</p>
        <button onClick={() => setInfoPreview(false)} className="cen px-4 py-2 bg-gray-500 text-white rounded-lg mt-1">OK</button>
      </div>
    </div>
  );
}

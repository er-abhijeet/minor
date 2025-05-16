import { useState } from 'react';
import { Camera, Clock, ClipboardList, User } from "lucide-react";

function Home() {
  const [cals,setCals]=useState(1200);
  const [protein,setProtein]=useState(20);
  const [carb,setCarb]=useState(40);
  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
      </div>
      
      {/* Summary */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-lg font-semibold">Todays Summary</h2>
        <div className="flex justify-around mt-2 text-center">
          <div>
            <p className="text-green-600 text-xl font-bold">{cals}</p>
            <p className="text-gray-500">Calories</p>
          </div>
          <div>
            <p className="text-blue-600 text-xl font-bold">{protein}g</p>
            <p className="text-gray-500">Protein</p>
          </div>
          <div>
            <p className="text-yellow-600 text-xl font-bold">{carb}g</p>
            <p className="text-gray-500">Carbs</p>
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="mt-4">
        <h2 className="text-lg font-semibold">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="bg-green-100 p-4 flex flex-col items-center rounded-lg shadow-md">
            <Camera className="text-green-600" />
            <p className="mt-2" >Scan Food</p>
          </div>
          <div className="bg-blue-100 p-4 flex flex-col items-center rounded-lg shadow-md">
            <ClipboardList className="text-blue-600" />
            <p className="mt-2">View History</p>
          </div>
        </div>
      </div>
      
      {/* Recent Meals */}
      <div className="mt-4">
        <h2 className="text-lg font-semibold">Recent Meals</h2>
        <div className="mt-2 p-4 bg-white shadow-md rounded-lg flex justify-between items-center">
          <div>
            <p className="font-medium">Breakfast</p>
            <p className="text-sm text-gray-500">8:30 AM</p>
          </div>
          <div>
            <p className="text-gray-700">450 kcal</p>
            <p className="text-sm text-gray-500">25g protein</p>
          </div>
        </div>
        <div className="mt-2 p-4 bg-white shadow-md rounded-lg flex justify-between items-center">
          <div>
            <p className="font-medium">Lunch</p>
            <p className="text-sm text-gray-500">12:30 PM</p>
          </div>
          <div>
            <p className="text-gray-700">650 kcal</p>
            <p className="text-sm text-gray-500">35g protein</p>
          </div>
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md p-2 flex justify-around">
        <div className="flex flex-col items-center text-green-600">
          <Camera />
          <p className="text-xs">Dashboard</p>
        </div>
        <div className="flex flex-col items-center text-gray-400">
          <Clock />
          <p className="text-xs">Scan</p>
        </div>
        <div className="flex flex-col items-center text-gray-400">
          <User />
          <p className="text-xs">Profile</p>
        </div>
      </div>
    </div>
  )
}

export default Home

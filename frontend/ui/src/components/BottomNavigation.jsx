// import React from 'react'
import { Camera, User } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { BotMessageSquare } from 'lucide-react';
import { ChartColumnIncreasing } from 'lucide-react';

function BottomNavigation(props) {
  const navigate = useNavigate();
    return (
        <>
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md p-2 flex justify-around">
        <div onClick={()=>{navigate('/');}} className={`flex flex-col items-center ${props.act? "text-gray-400":"text-green-600"}`}>
          <Camera />
          <p className="text-xs">Dashboard</p>
        </div>
        <div onClick={()=>{navigate('/bot');}} className={`flex flex-col items-center ${props.act=="bot"? "text-green-600":"text-gray-400"}`}>
        <BotMessageSquare />
          <p className="text-xs">Bot</p>
        </div>
        <div onClick={()=>{navigate('/analytics');}} className={`flex flex-col items-center ${props.act=="analytics"? "text-green-600":"text-gray-400"}`}>
         <ChartColumnIncreasing />
          <p className="text-xs">Analytics</p>
        </div>
        <div onClick={()=>{navigate('/profile');}} className={`flex flex-col items-center ${props.act=="profile"? "text-green-600":"text-gray-400"}`}>
          <User />
          <p className="text-xs">Profile</p>
        </div>
      </div>
      </>
    )
}

export default BottomNavigation

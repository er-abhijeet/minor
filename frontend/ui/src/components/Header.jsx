// import React from 'react'
import { Calculator } from "lucide-react";

function Header(props) {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Dashboard</h1>
        
        <div 
  className="w-10 h-10 rounded-full flex justify-center items-center" 
  onClick={() => props.setInfoPreview(true)}
>
  <Calculator className="w-18"/>
</div>
      </div>
    </>
  );
}

export default Header;

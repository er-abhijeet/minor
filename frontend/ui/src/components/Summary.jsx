// import React from 'react'

function Summary(props) {
    return (
        <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-lg font-semibold">Todays Summary</h2>
        <div className="flex justify-around mt-2 text-center">
          <div>
            <p className="text-green-600 text-xl font-bold">{props.cals}</p>
            <p className="text-gray-500">Calories</p>
          </div>
          <div>
            <p className="text-blue-600 text-xl font-bold">{props.protein}g</p>
            <p className="text-gray-500">Protein</p>
          </div>
          <div>
            <p className="text-yellow-600 text-xl font-bold">{props.carb}g</p>
            <p className="text-gray-500">Carbs</p>
          </div>
        </div>
        {props.targetCals&&(<h2 className="text-l font-semibold mt-2">Target calories: {props.targetCals}</h2>)}
        

      </div>
    )
}

export default Summary

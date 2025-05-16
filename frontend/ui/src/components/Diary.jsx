// import React from 'react'

function Diary(props) {
  const toTime=(date)=>{
    const date1 = new Date(date);
    const hours = date1.getHours().toString().padStart(2, '0');
    const minutes = date1.getMinutes().toString().padStart(2, '0');1
    return `${hours}:${minutes}`
// console.log(date1.toLocaleString()); // Converts to local time
// console.log(date1.toUTCString()); // Converts to UTC time
// console.log(date1.toTimeString()); // Extracts time only
  }
  return (
    <>
      {props.foodDiary.map((meal, index) => (
        <div
          key={index}
          className="mt-2 p-4 bg-white shadow-md rounded-lg flex justify-between items-center"
        >
          <div>
            <p className="font-medium">{meal.food_item}</p>
            <p className="text-sm text-gray-500">{toTime(meal.date)}</p>
          </div>
          <div>
            <p className="text-gray-700">{meal.calories} kcal</p>
            <p className="text-sm text-gray-500">{meal.protein}g protein</p>
          </div>
        </div>
      ))}
    </>
  );
}

export default Diary;

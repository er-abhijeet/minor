import { useState , useRef, useEffect, useContext} from "react";
import "./App.css";
import FoodSelection from "./components/FoodSelections";
import FoodConfirmation from "./components/FoodConfirmation";
import Header from "./components/Header";
import Summary from "./components/Summary";
import ShowImport from "./components/ShowImport";
import Preview from "./components/Preview";
import BottomNavigation from "./components/BottomNavigation";
import QuickActions from "./components/QuickActions";
import Diary from "./components/Diary";
import CameraView from "./components/CameraView";
import UserInfo from "./components/UserInfo";
import WaterTracker from "./components/WaterTracker";
import UserContext from "./context/UserContext";
// import "dotenv/config"

function App() {
  const { ipad } = useContext(UserContext);
  const ip=ipad; // for backend
  const [confirmMesssage, setConfirmMesssage] = useState(null);
  // const [con, setCon] = useState("h");
  const [temp, setTemp]= useState([]);
  const [foodDiary, setFoodDiary] = useState([]);
  const [preview, setPreview] = useState(null);
  const [forPreview, setForPreview] = useState(null);
  const [foodList, setFoodList] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false); // Track camera visibility
  const [showImportDialog, setShowImportDialog] = useState(false); // Show dialog for import options
  // const [fileInput, setFileInput] = useState(null); // For file input
  const [infoPreview, setInfoPreview] = useState(false);
  const [targetCals, setTargetCals] = useState(null);
  const [waterInput,setWaterInput] = useState(false);
  const [glasses, setGlasses] = useState(0);

  const webcamRef = useRef(null);
  const { user } = useContext(UserContext);
  const userId = user[0];
  // const userId=2;
  useEffect(() => {
    fetch(`${ip}/food-diary/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setFoodDiary(data);
      })
      .catch((err) => console.error("Error fetching food diary:", err));
  }, []);
  useEffect(() => {
    const fetchTargetCalories = async () => {
      try {
        const response = await fetch(`${ip}/userdata/?userId=${userId}`);
        const data = await response.json();
        if (data[0].targetcalories) setTargetCals(data[0].targetcalories);
        // console.log('herre',data[0]);
      } catch (error) {
        console.error("Error fetching target calories:", error);
      }
    };

    fetchTargetCalories();
  }, []);
  useEffect(() => {
    fetch(`${ip}/macros/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setCals(data.total_cals || 0);
        setProtein(data.total_protein || 0);
        setCarb(data.total_carbs || 0);
      })
      .catch((err) => console.error("Error fetching macros:", err));
  }, []);
  const makeArr=(ob)=>{
    let ar=[];
    for(let i of ob){
      ar.push(i.label);
    }
    return ar;
  }
  const capturePhoto = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setForPreview(imageSrc);
    // Create a canvas to convert the image
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.src = imageSrc;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        const file = new File([blob], "captured_image.jpg", {
          type: "image/jpeg",
        });

        setPreview(file);
        setIsCameraOpen(false);
      }, "image/jpeg");
    };
  };

  // Function to retake the image
  const handleRetake = () => {
    setPreview(null);
    setIsCameraOpen(true); // Reopen webcam
  };
  
  // Function to confirm and send image to API
  const handleConfirm = async () => {
    if (!preview) return;
    //image model
    try {
      const API_URL =
        "https://api-inference.huggingface.co/models/dima806/indian_food_image_detection";
      const API_KEY = import.meta.env.VITE_hf_key ;

      // const formData = new FormData();
      // formData.append("file", preview);

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
        body: preview,
      });

      const result = await response.json();
      console.log("API Response:", result);
      // console.log(typeof result);
      let ar=makeArr(result);
      setFoodList(ar);
      // setCon(JSON.stringify(result));
      setShowImportDialog(false);
      // alert("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image.");
    }

    // Clear the preview after submission
    // handleRetake();
    setPreview(null);
  };

  // Handle file input change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    
    if (file) {
      // Check if the file is already a JPG
      
      if (file.type !== "image/jpeg") {
        // If the file is not a JPG, convert it to JPG
        const reader = new FileReader();
        reader.onload = () => {
          const img = new Image();
          img.src = reader.result;
          setForPreview(img.src);
          img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            // setForPreview(newFile);
            // Convert to JPG and get the result as a blob
            canvas.toBlob((blob) => {
              const newFile = new File(
                [blob],
                file.name.replace(/\.[^/.]+$/, ".jpg"),
                {
                  type: "image/jpeg",
                }
              );
              setPreview(newFile);
              
            }, "image/jpeg");
          };
        };
        reader.readAsDataURL(file);
      } else {
        // If the file is already a JPG, directly set the preview
        setPreview(file);
        setForPreview(file);
      }
    }
  };
  const handleAdd = async () => {
    const date = new Date();
    const ob = {
      userId: userId, // Replace with actual userId
      name: "Abhijeet",
      dateTime:  new Date(date.getTime() + (5.5 * 60 * 60 * 1000)).toISOString(), 
      foodItem: temp[0],
      cals: temp[1],
      protein: temp[2],
      carbs: temp[3]
    };
    // console.log(foodDiary);
    
    try {
      const response = await fetch(`${ip}/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(ob)
      });
  
      const data = await response.json();
      // console.log(data);
  
      if (response.ok) {
        setCals(Number(parseInt(cals) + parseInt(temp[1])));
        setProtein(Number(parseInt(protein) + parseInt(temp[2])));
        setCarb(Number(parseInt(carb) + parseInt(temp[3])));
        fetch(`${ip}/all/?userId=${userId}`)
        .then((res)=>{
          return res.json();
        }).then((data)=>{
        setFoodDiary([data[data.length - 1], ...foodDiary]);
        })
        setConfirmMesssage(null);
        
      } else {
        alert("Error adding food!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to add food.");
    }
  };
  
  const handleDiscard = ()=>{
    setConfirmMesssage(null);
  } 

  // const handleFileChange = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     // const reader = new FileReader();
  //     // reader.onload = (e) => {
  //       const img = new Image();
  //       img.src = file;
  //       // img.onload = () => {
  //         // Convert to JPEG using a canvas
  //         const canvas = document.createElement("canvas");
  //         const ctx = canvas.getContext("2d");
  //         canvas.width = img.width;
  //         canvas.height = img.height;
  //         ctx.drawImage(img, 0, 0);

  //         // Convert to JPEG with quality 0.9
  //         const jpegBase64 = canvas.toDataURL("image/jpeg", 0.9);
  //         setPreview(jpegBase64); // Store the JPEG version
  //       // };
  //     // };
  //     // reader.readAsDataURL(file);
  //   }
  // };
  const handlefoodSubmit=(event)=>{
    setFoodList(null);
    let convertedStr = event.food;
    convertedStr = convertedStr.replace(/_/g, ' ');
    const mess=`${event.quantity} ${event.unit} of ${convertedStr}`;
    const options = {
      method: "GET",
      headers: {
          "Content-Type": "application/json",
          'X-Api-Key': import.meta.env.VITE_cal_key,
      }
    }
    console.log(mess);
    fetch(`https://api.calorieninjas.com/v1/nutrition?query=${mess}`, options)
    .then((str) => str.json())
    .then((data)=>{
      if(!data.items.length){alert("Doesn't seem like anything to eat.")}
      const food=data.items[0];
      let msg = `${food.serving_size_g}g of ${food.name} has ${Math.floor(parseFloat(food.calories))} calories and ${Math.floor(parseFloat(food.protein_g))}g protein and ${Math.floor(parseFloat(food.carbohydrates_total_g))}g of carbs.\n Do you want to Add this??`
      setConfirmMesssage(msg);
      let arr=[food.name,Math.floor(parseFloat(food.calories)),Math.floor(parseFloat(food.protein_g)),Math.floor(parseFloat(food.carbohydrates_total_g))];
      setTemp(arr);
    })
    console.log(event);
  }
  const [cals, setCals] = useState(0);
  const [protein, setProtein] = useState(0);
  const [carb, setCarb] = useState(0);

  return (
    <div className="p-4 bg-gray-100 min-h-screen">

      {/* Header */}
      <Header setInfoPreview={setInfoPreview}/>

      {/* Summary */}
      <Summary cals={cals} carb={carb} protein={protein} targetCals={targetCals || "Not set"}/>

      {/* Quick Actions */}
      <QuickActions setShowImportDialog={setShowImportDialog} setWaterInput={setWaterInput} />

      {/* Import Dialog */}
      {showImportDialog && (
        <ShowImport 
        preview={preview}
      setShowImportDialog={setShowImportDialog}
      setIsCameraOpen={setIsCameraOpen}
      handleFileChange={handleFileChange}
      forPreview={forPreview}
      handleRetake={handleRetake}
      handleConfirm={handleConfirm}
        />
      )}

      {/* Camera View */}
      {isCameraOpen && (
        <CameraView capturePhoto={capturePhoto} webcamRef={webcamRef}/>
      )}

      {/* Preview */}
      {preview && (
        <Preview
        handleConfirm={handleConfirm}
        handleRetake={handleRetake}
        forPreview={forPreview}
      />
      )}
      {infoPreview && (
        <UserInfo userId={userId} setInfoPreview={setInfoPreview} targetCals={targetCals} setTargetCals={setTargetCals}/>
      )}
      {foodList && (
        <FoodSelection foodItems={foodList} onSubmit={handlefoodSubmit}  />
      )}

      {confirmMesssage && (
        <FoodConfirmation msg={confirmMesssage} onAdd={handleAdd} onDiscard={handleDiscard} />
      )}
      {waterInput &&(
        <WaterTracker setWaterInput={setWaterInput} glasses={glasses} setGlasses={setGlasses}/>
      )}

      {/* Recent Meals */}
      <div className="mt-4">
      <h2 className="text-lg font-semibold">Recent Meals</h2>
      <Diary foodDiary={foodDiary}/>
      <div className="mb-14"></div>
    </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}

export default App;

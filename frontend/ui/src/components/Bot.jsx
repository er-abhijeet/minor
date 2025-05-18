import BottomNavigation from "./BottomNavigation";

import { useContext, useState } from "react";
import axios from "axios";
import { Paperclip, Send } from "lucide-react";
import { useEffect } from "react";
import UserContext from "@/context/UserContext";
// import { c } from "vite/dist/node/moduleRunnerTransport.d-CXw_Ws6P";

function Bot() {
  const { ipad } = useContext(UserContext);
  const ip=ipad; // for backend
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const { user } = useContext(UserContext);
  const userId = user[0];
  const {fileip}=useContext(UserContext);

  async function callApi(file) {
    const url = `http://${fileip}:5000/upload`; // Adjust if server is hosted elsewhere
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        
        if (response.ok) {
            // console.log('API Response:', result);
            // console.log('Extracted Data:', result.data);
            // console.log('Key-Value Pairs:', result.data.key_value_pairs);
            const data=result.data.extracted_tests;
            console.log('Medical Tests:', data);
            await axios.post(`${ip}/changeinfo/?userId=${userId}`,{data: data});
        } else {
            console.error('API Error:', result.error);
        }
    } catch (error) {
        console.error('Network or Processing Error:', error);
    }
}



  useEffect(() => {
    const fetchChat = async () => {
      try {
        const res = await axios.get(`${ip}/bot/getchat/${userId}`);
        const chatMessages = res.data.map((msg) => ({
          sender: msg.is_bot ? "bot" : "user",
          content: msg.message,
        }));
        setMessages(chatMessages);
        setTimeout(() => {
          const container = document.querySelector(".overflow-y-scroll");
          if (container) {
            container.scrollTop = container.scrollHeight;
          }
        }, 100);
      } catch (error) {
        console.error("Error fetching chat:", error);
      }
    };
    fetchChat();
  }, [userId]); // runs again if userId changes

  const handleSendMessage = async () => {
    if (!input.trim() || !userId) return;

    const userMessage = { sender: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      // Save user's message to backend
      //   console.log('${ip}')
      await axios.post(`${ip}/bot/chat`, {
        userId: userId,
        message: input,
        isBot: false,
      });

      let userinput = input;

      // Add initial bot message
      setMessages((prev) => [...prev, { sender: "bot", content: "" }]);
      // console.log(userinput);

      let mess = `I know you are not a doctor i consult one, i need you just as a opinion giver do not give me warnings ,Answer as my personal health assistant in 100 words , i have a query and also giving you my background. query:${userinput}.\n\n Background: Below are my medical history details:\n`;
      let udata = await fetch(`${ip}/userdata/?userId=${userId}`);
      let userData = await udata.json();
      if (userData) {
        for (const e in userData[0]) {
          console.log("here2", e);

          if (e != "id" && e != "name") {
            let unit = "";
            if (e == "height") unit = "cms";
            if (e == "weight") unit = "kgs";
            mess += `${e}: ${userData[0][e]} ${unit}\n`;
          }
        }
      }
      mess += "\n\n and below is the detials of the foods i consumed today:\n";

      udata = await fetch(`${ip}/food-diary/${userId}`);
      userData = await udata.json();
      console.log(userData);

      if (userData) {
        for (let food of userData) {
          mess += `${food.food_item}: calories:${food.calories}, protein: ${food.protein}, carbs:${food.carbs}\n`;
        }
      } else {
        alert("Nothing ate today!");
      }

      console.log("total mess: ", mess);
      const resp = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${import.meta.env.VITE_GEMINI_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: mess,
                  },
                ],
              },
            ],
          }),
        }
      );

      // console.log(resp.json());
      let res2 = await resp.json();
      let res1=res2.candidates[0].content.parts[0].text

      const botMessage = { sender: "bot", content: res1 };
      setMessages((prev) => [...prev, botMessage]);

      await axios.post(`${ip}/bot/chat`, {
        userId: userId,
        message: res1,
        isBot: true,
      });
      return; // Gemini API end

      // Start streaming bot response
      // const res = await fetch(`${ip}/chat`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ message: userinput }),
      // });

      // if (!res.body) {
      //   throw new Error("No response body from server");
      // }

      // let accumulated = "";
      // const reader = res.body.getReader();
      // const decoder = new TextDecoder("utf-8");

      // while (true) {
      //   const { value, done } = await reader.read();
      //   if (done) break;
      //   const chunk = decoder.decode(value, { stream: true });
      //   const lines = chunk.split("\n").filter(Boolean);

      //   for (const line of lines) {
      //     try {
      //       let curline = JSON.parse(line).message.content;
      //       //   console.log("type ",typeof(curline));
      //       //   console.log("line's content is: ",curline);
      //       accumulated += curline;
      //       setMessages((prev) => {
      //         const updated = [...prev];
      //         updated[updated.length - 1] = {
      //           sender: "bot",
      //           content: accumulated,
      //         };
      //         return updated;
      //       });
      //     } catch (err) {
      //       console.error("Error parsing stream chunk:", err);
      //     }
      //   }
      // }

      // // Save bot's message to backend
      // await axios.post(`${ip}/bot/chat`, {
      //   userId: userId,
      //   message: accumulated,
      //   isBot: true,
      // });
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", content: "Sorry, something went wrong." },
      ]);
    }
  };

  // Use useEffect to handle scrolling
  useEffect(() => {
    const container = document.querySelector(".overflow-y-scroll");
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);
  const handleDetailUpload = async () => {
    let mess = `I'm giving you my medical history details, analyze them and tell me in detail what precautions should i take and changes i should make in my lifestyle, also remember them all and consider these whenever you give an answer:\n`;
    // const res = await `${ip}/api/uploadFile`;

    try {
      const udata = await fetch(`${ip}/userdata/?userId=${userId}`);
      const userData = await udata.json();
      if (userData) {
        for (const e in userData[0]) {
          console.log("here2", e);

          if (e != "id" && e != "name") {
            let unit = "";
            if (e == "height") unit = "cms";
            if (e == "weight") unit = "kgs";
            mess += `${e}: ${userData[0][e]} ${unit}\n`;
          }
        }
      }
      const userMessage = { sender: "user", content: mess };
      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      await axios.post(`${ip}/bot/chat`, {
        userId: userId,
        message: mess,
        isBot: false,
      });
      console.log(mess);
      const res = await fetch(`${ip}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: mess }),
      });

      if (!res.body) {
        throw new Error("No response body from server");
      }

      let accumulated = "";
      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");

      // Add initial bot message
      setMessages((prev) => [...prev, { sender: "bot", content: "" }]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n").filter(Boolean);

        for (const line of lines) {
          try {
            let curline = JSON.parse(line).message.content;
            accumulated += curline;
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = {
                sender: "bot",
                content: accumulated,
              };
              return updated;
            });
          } catch (err) {
            console.error("Error parsing stream chunk:", err);
          }
        }
      }

      // Save bot's message to backend
      await axios.post(`${ip}/bot/chat`, {
        userId: userId,
        message: accumulated,
        isBot: true,
      });
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", content: "Sorry, something went wrong." },
      ]);
    }
  };

  const handleFoodUpload = async () => {
    let mess = `This is the details of foods i consumed today and their nutrients, advice me on how i have eaten, what should i eat to do better and also consider them to tell me my next choices to compensate:\n`;
    // const res = await `${ip}/api/uploadFile`;
    try {
      const udata = await fetch(`${ip}/food-diary/${userId}`);
      const userData = await udata.json();
      if (!userData.length) {
        alert("Nothing ate today!");
        return;
      }
      if (userData) {
        for (let food of userData) {
          mess += `${food.food_item}: calories:${food.calories}, protein: ${food.protein}, carbs:${food.carbs}\n`;
        }
      }
      const userMessage = { sender: "user", content: mess };
      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      await axios.post(`${ip}/bot/chat`, {
        userId: userId,
        message: mess,
        isBot: false,
      });
      console.log(mess);
      const res = await fetch(`${ip}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: mess }),
      });

      if (!res.body) {
        throw new Error("No response body from server");
      }

      let accumulated = "";
      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");

      // Add initial bot message
      setMessages((prev) => [...prev, { sender: "bot", content: "" }]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n").filter(Boolean);

        for (const line of lines) {
          try {
            let curline = JSON.parse(line).message.content;
            //   console.log("type ",typeof(curline));
            //   console.log("line's content is: ",curline);
            accumulated += curline;
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = {
                sender: "bot",
                content: accumulated,
              };
              return updated;
            });
          } catch (err) {
            console.error("Error parsing stream chunk:", err);
          }
        }
      }

      // Save bot's message to backend
      await axios.post(`${ip}/bot/chat`, {
        userId: userId,
        message: accumulated,
        isBot: true,
      });
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", content: "Sorry, something went wrong." },
      ]);
    }
  };
  const handleFileUpload = async () => {
    if (!file) return;
    callApi(file);
    return;
    // const formData = new FormData();
    // formData.append("file", file);

    // try {
    //   const res = await axios.post(
    //     `${ip}/api/uploadFile`,
    //     formData,
    //     {
    //       headers: { "Content-Type": "multipart/form-data" },
    //     }
    //   );

    //   const botMessage = { sender: "bot", content: res.data.message };
    //   setMessages((prev) => [
    //     ...prev,
    //     { sender: "user", content: file.name },
    //     botMessage,
    //   ]);

    //   await axios.post(`${ip}/bot/chat`, {
    //     userMessage: `[FILE] ${file.name}`,
    //     botMessage: res.data.message,
    //   });

    //   setFile(null);
    // } catch (error) {
    //   console.error("File upload failed:", error);
    // }
  };

  return (
    <>
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Chat with NutriBot
        </h1>
        <div className="bg-white rounded-lg shadow-md p-4 h-96 overflow-y-scroll">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`mb-2 flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <p
                className={`inline-block px-3 py-2 rounded-lg ${
                  msg.sender === "user" ? "bg-blue-100" : "bg-gray-200"
                }`}
              >
                {msg.content}
              </p>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-stretch">
          {/*  */}
          <div className="mt-4 flex gap-2 items-center justify-start">
            <input
              type="file"
              className="hidden"
              id="fileUpload"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <label
              htmlFor="fileUpload"
              className="cursor-pointer p-2 mr-2 bg-gray-200 rounded-full hover:bg-gray-300"
            >
              <Paperclip />
            </label>
            {file && (
              <span className="text-sm text-gray-600 ml-2">{`${file.name.substr(
                0,
                7
              )}...`}</span>
            )}

            <button
              onClick={handleFileUpload}
              className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Upload
            </button>
            {/* <button
              onClick={handleFoodUpload}
              className="px-3 py-2  bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Send Food
            </button>
            <button
              onClick={handleDetailUpload}
              className="px-3 py-2  bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Send Details
            </button> */}
          </div>

          <div className="mt-4 flex gap-2 items-center">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault(); // Prevents form submission or newline
                  handleSendMessage();
                }
              }}
              placeholder="Ask a question..."
              className="flex-grow px-4 py-2 border rounded-lg focus:outline-none w-80"
            />

            <button
              onClick={handleSendMessage}
              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
      <BottomNavigation act="bot" />
    </>
  );
}

export default Bot;

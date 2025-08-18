import  { useEffect, useState } from 'react'
import UserContext from './UserContext'


function UserContextProvider({children}) {
    // const [user,setUser]=useState([2,"Abhijeet"])
    const render_backend=`https://minor-backend-ujgq.onrender.com`
    const local="http://localhost:3000";
    const ipad=render_backend;
    const fileip="http://flask-back-8eil.onrender.com/" || "192.168.227.166"
    const [user, setUser] = useState(() => {
        // Try to get user from localStorage on first render
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : [2,"Abhijeet"];
      });
    
      useEffect(() => {
        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
        }
      }, [user]);
    
    return (
        <UserContext.Provider value={{user,setUser,ipad,fileip}}>
            {children}
        </UserContext.Provider>

    )
}

export default UserContextProvider

import  { useEffect, useState } from 'react'
import UserContext from './UserContext'


function UserContextProvider({children}) {
    // const [user,setUser]=useState([2,"Abhijeet"])
    const ipad="localhost";
    const fileip="192.168.227.166"
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

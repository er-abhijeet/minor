// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import ReactDOM from 'react-dom/client'
import React from 'react'
import Bot from './components/Bot'
import UserProfile from './components/UserProfile'
import UserContextProvider from './context/UserContextProvider'
import Analytics from './components/Analytics'


// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )

const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    // children: [
    //   {
    //     path: "",
    //     element: <Home />
    //   },
    //   {
    //     path: "about",
    //     element: <About />
    //   },
    //   {
    //     path: "contact",
    //     element: <Contact />
    //   }
    // ]
  },
  {
    path: '/bot',
    element: <Bot userId = {2} />
  },
  {
    path: "/profile",
    element: <UserProfile userId = {2}/>
  },
  {
    path: "/analytics",
    element: <Analytics userId = {2}/>
  }
])



ReactDOM.createRoot(document.getElementById('root')).render(
  <UserContextProvider>
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
  </UserContextProvider>
)

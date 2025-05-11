import React from "react";
import {
  Register,
  Signin,
  Home,
  Dashboard,
  WatchVideo,
  ProfileSettings,
  Subscription,
} from './pages/index.js'
// import {Navbar} from './Components/Navbar.jsx'
import {
  SideNavbar
} from './Components/index.js'

import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { UploadVideo } from "./pages/UploadVideo.jsx";



const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/register" element={<Register />} />
        <Route path="/sign-in" element={<Signin/>} />
        {/* <Route path="/logout" element={<Logout/>} /> */}
        <Route path="/dashboard" element={<Dashboard/>} />
        {/* <Route path="/navbar" element={<Navbar/>} /> */}
        <Route path="/upload-a-video" element={<UploadVideo/>} />
        <Route path="/watch-video/:id" element={<WatchVideo/>} />
        <Route path="/profile-settings" element={<ProfileSettings/>} />
        <Route path="/subscribed-channels" element={<Subscription/>} />
        <Route path="/side-navbar" element={<SideNavbar/>} />
      </Routes>
    </Router>
    
    // <div>
    //   <h1>My Application</h1>
    //   <Register />
    // </div>
  );
};

export default App;

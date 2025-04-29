import React from "react";
import {
  Register,
  Signin,
  // Logout,
  Dashboard
} from './pages/index.js'
// import {Navbar} from './Components/Navbar.jsx'
// import {Home} from './Components/Home'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'



const App = () => {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Home/>} /> */}
        <Route path="/register" element={<Register />} />
        <Route path="/sign-in" element={<Signin/>} />
        {/* <Route path="/logout" element={<Logout/>} /> */}
        <Route path="/dashboard" element={<Dashboard/>} />
        {/* <Route path="/navbar" element={<Navbar/>} /> */}
      </Routes>
    </Router>
    
    // <div>
    //   <h1>My Application</h1>
    //   <Register />
    // </div>
  );
};

export default App;

import React from "react";
import 
{
  Register,
  Signin

} from './Components/index.js'
// import {Home} from './Components/Home'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'



const App = () => {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Home/>} /> */}
        <Route path="/register" element={<Register />} />
        <Route path="/sign-in" element={<Signin/>} />
      </Routes>
    </Router>
    
    // <div>
    //   <h1>My Application</h1>
    //   <Register />
    // </div>
  );
};

export default App;

import React, { useState } from 'react';// import React library to use its features
import './App.css';  // import CSS file for styling
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; // import components from react-router-dom for routing
import Subject from './components/Subject'; // import a component called Subject
import Dashboard from './components/Dashboard'; // import a component called Dashboard
import Login from './components/Login';
import RegisterNewStudent from './components/RegisterNewStudent';


function App() {
  // get today's date and format it
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const today = new Date().toLocaleDateString(undefined, options);

  const [ userData, setUserData ] = useState(null);
  
  return (
    <Router>{/* Router component is used to wrap all our routes */}
      <div>
            {/* Today's date */}
        <div className="date">{today}</div>


        <Routes>{/* Routes component holds all our defined routes */}
          <Route path="/" element={<Login setUserData = { setUserData }/>} /> 
          {/*Route for main page, which features a login form and the link to registration page if student is not added to database*/}
          <Route path="/RegisterNewStudent" element={<RegisterNewStudent />} />
          <Route path="/dashboard" element={<Dashboard userData = { userData } />} /> 
          {/* Route for Dashboard, which is shown when the student is logged in */}
          <Route path="/:subject" element={<Subject />} /> 
          {/* Route for the Subject component, which is shown when the URL has something after /, like /math or /science */}
          {/* :subject captures whatever comes after the route, so you can grab values from the URL */}
        </Routes>
    
      </div>


    </Router>
  );
}

export default App;
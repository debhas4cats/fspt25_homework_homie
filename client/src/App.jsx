import React from 'react';// import React library to use its features
import './App.css';  // import CSS file for styling
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; // import components from react-router-dom for routing
import Subject from './components/Subject'; // import a component called Subject
import Dashboard from './components/Dashboard'; // import a component called Dashboard


function App() {
  return (
    <Router>{/* Router component is used to wrap all our routes */}
      <div>
            {/* Today's date */}
        <div className="date">{today}</div>

      
      <h1>Homework Homie</h1>
    
      </div>


    </Router>
  );
}

export default App;
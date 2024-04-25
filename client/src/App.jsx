import React from 'react';
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Subject from './components/Subject';
import Dashboard from './Dashboard';


function App() {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const today = new Date().toLocaleDateString(undefined, options);
 
  return (
    <Router>
      <div>
            {/* Today's date */}
        <div className="date">{today}</div>


        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/:subject" element={<Subject />} /> 
          {/* what comes after the route, you can grab values - you can create variables when you use the colon */}
          
        </Routes>
    
      </div>


    </Router>
  );
}

export default App;
import React from 'react';
import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MathComponent from './Component_math';
import ScienceComponent from './Component_science';
import HistoryComponent from './Component_history';
import GermanComponent from './Component_german';
import EnglishComponent from './Component_english';
import ArtComponent from './Component_art';
import Home from './Component_app_homepage';


function App() {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const today = new Date().toLocaleDateString(undefined, options);
 
  return (
    <Router>
      <div>
            {/* Today's date */}
        <div className="date">{today}</div>


        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/math" element={<MathComponent />} />
          <Route path="/science" element={<ScienceComponent />} />
          <Route path="/history" element={<HistoryComponent />} />
          <Route path="/german" element={<GermanComponent />} />
          <Route path="/english" element={<EnglishComponent />} />
          <Route path="/art" element={<ArtComponent />} />
        </Routes>
    
      </div>


    </Router>
  );
}

export default App;
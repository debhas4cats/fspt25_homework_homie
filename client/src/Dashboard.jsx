import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';

function Dashboard() {
  return (
    <div>
      <div className="title-and-button-container">
        <div className='title-container'>
          <h1 className='title'>
            <span>HOMEWORK</span>
            <span>HOMIE</span>
          </h1>
        </div>
        <div className="button-container">
          <Link to="/math" className="rounded-button">MATH</Link>
          <Link to="/science" className="rounded-button">SCIENCE</Link>
          <Link to="/history" className="rounded-button">HISTORY</Link>
          <Link to="/german" className="rounded-button">GERMAN</Link>
          <Link to="/english" className="rounded-button">ENGLISH</Link>
          <Link to="/art" className="rounded-button">ART</Link>
        </div>
      </div>
    </div>
  );
}
export default Dashboard;

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './App.css'

function Home() {
  useEffect(() => {
    const buttons = document.querySelectorAll('.rounded-button');
    const angle = (Math.PI * 2) / buttons.length;
    const radius = 220; // Adjust the radius as needed

    buttons.forEach((button, index) => {
      const x = Math.cos(angle * index) * radius;
      const y = Math.sin(angle * index) * radius;
      button.style.transform = `translate(${x}px, ${y}px)`;
    });
  }, []);

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
          <Link to="/math"><button className="rounded-button">MATH</button></Link>
          <Link to="/science"><button className="rounded-button">SCIENCE</button></Link>
          <Link to="/history"><button className="rounded-button">HISTORY</button></Link>
          <Link to="/german"><button className="rounded-button">GERMAN</button></Link>
          <Link to="/english"><button className="rounded-button">ENGLISH</button></Link>
          <Link to="/art"><button className="rounded-button">ART</button></Link>
        </div>
      </div>
    </div>
  );
}

export default Home;

import React from 'react';
import { Link} from 'react-router-dom';
import './App.css'

function ScienceComponent() {
  return (
    <div>
        <Link to="/">
        <button className="home-rounded-button">HOME</button>
      </Link>

      <h2>Science Component</h2>
      <p>This is the Science page</p>
    </div>
  );
}

export default ScienceComponent;
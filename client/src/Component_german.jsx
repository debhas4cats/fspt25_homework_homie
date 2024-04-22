import React from 'react';
import { Link} from 'react-router-dom';
import './App.css'

function GermanComponent() {
  return (
    <div>
       <Link to="/">
        <button className="home-rounded-button">HOME</button>
      </Link>

      <h2>German Component</h2>
      <p>This is the German page</p>
    </div>
  );
}

export default GermanComponent;
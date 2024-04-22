import React from 'react';
import { Link} from 'react-router-dom';
import './App.css'

function MathComponent() {
  return (
    <div>
       <Link to="/">
        <button className="home-rounded-button">HOME</button>
      </Link>

      <h2>Math Component</h2>
      <p>This is the Math page</p>
    </div>
  );
}

export default MathComponent;
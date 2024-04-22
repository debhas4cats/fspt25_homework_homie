import React from 'react';
import { Link} from 'react-router-dom';
import './App.css'

function EnglishComponent() {
  return (
    <div>
       <Link to="/">
        <button className="home-rounded-button">HOME</button>
      </Link>

      <h2>English Component</h2>
      <p>This is the English page</p>
    </div>
  );
}

export default EnglishComponent;
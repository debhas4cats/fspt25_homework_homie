import React from 'react';
import { Link} from 'react-router-dom';
import './App.css'

function ArtComponent() {
  return (
    <div>
      <Link to="/">
        <button className="home-rounded-button">HOME</button>
      </Link>
    
      <h2>Art Component</h2>
      <p>This is the Art page</p>
    </div>
  );
}

export default ArtComponent;
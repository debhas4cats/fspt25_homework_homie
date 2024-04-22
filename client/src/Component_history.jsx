import React from 'react';
import { Link} from 'react-router-dom';
import './App.css'

function HistoryComponent() {
  return (
    <div>
       <Link to="/">
        <button className="home-rounded-button">HOME</button>
      </Link>

      <h2>History Component</h2>
      <p>This is the History page</p>
    </div>
  );
}

export default HistoryComponent;
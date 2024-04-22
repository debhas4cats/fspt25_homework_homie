import React from 'react';
import { Link, useParams} from 'react-router-dom';
import '../App.css'

function SubjectComponent() {
  const {subject} = useParams();
  return (
    <div>
      <Link to="/">
        <button className="home-rounded-button">HOME</button>
      </Link>
    
      <h2>{subject} Component</h2>
      <p>Teacher name</p>
      <p>{subject}</p>
    </div>
  );
}

export default SubjectComponent;
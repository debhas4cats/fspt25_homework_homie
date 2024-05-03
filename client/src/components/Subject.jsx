import React from 'react';
import { Link, useParams, useLocation} from 'react-router-dom';
import '../App.css';

function SubjectComponent() {
  const {subject} = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const teacher = searchParams.get('teacher');
  console.log(teacher);
  return (
    <div><Link to="/Dashboard">
        <button className="home-rounded-button">HOME</button>
      </Link>

      <h2>{subject} Component</h2>
      <p>Your {subject} teacher is:</p>
      <p>{teacher}</p>
    </div>
  );
} 

// PropTypes definition (if you're using PropTypes)
SubjectComponent.propTypes = {
  // Define your PropTypes here
};

export default SubjectComponent;
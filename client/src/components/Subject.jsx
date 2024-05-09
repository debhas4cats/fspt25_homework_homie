import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import '../App.css';



function SubjectComponent() {
  
  const {subject, subjectId} = useParams();
  // console.log(subject);
  // console.log(subjectId);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const teacher = searchParams.get('teacher');
  const studentId = searchParams.get('studentId'); // Extract studentId from query params
  console.log(teacher);


  
  
 
    
  const [homework, setHomework] = useState([]);
  const [newHomework, setNewHomework] = useState({
    assignment: '',
    description: '',
    dueDate: '',
    priority: '',
    completed: false,
    pastdue: false,
  });
  // const { subject } = useParams();
  useEffect(() => {
    fetchHomeworkForSubjects();
  }, []);

  async function fetchHomeworkForSubjects() {
    try {
      const response = await fetch(`/api/homework/subjects/6/students/studentId/homework`);
      if (!response.ok) {
        throw new Error('Failed to fetch homework data');
      }
      const data = await response.json();
      setHomework(data.data);
      console.log(`Homework ID: ${homework.id}, Subject: ${homework.subject}, Description: ${homework.description}`);
    } catch (error) {
      console.error('Error fetching homework data:', error);
    }
  }

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setNewHomework(prevHomework => ({
      ...prevHomework,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const addedHomework = await addHomework(newHomework);
      setHomework([...homework, addedHomework]);
      setNewHomework({
        assignment: '',
        description: '',
        dueDate: '',
        priority: '',
        completed: false,
        pastdue: false,
      });
    } catch (error) {
      console.error('Error adding homework:', error);
    }
  };

  const addHomework = async (data) => {
    try {
      const response = await fetch('/api/homework', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to add homework');
      }
      const responseData = await response.json();
      return responseData.homework;
    } catch (error) {
      console.error('Error adding homework:', error);
      throw error;
    }
  };

  const deleteHomework = async (id) => {
    console.log('Deleting homework with ID:', id);
    try {
      // Logic to delete homework with the specified ID
    } catch (error) {
      console.error('Error deleting homework:', error);
    }
  };

  return (
    <div>
      <Link to="/dashboard">
        <button className="home-rounded-button">HOME</button>
      </Link>
      <div className="container">
        <h1 className="text-primary">Homework Tracker</h1>
        <form onSubmit={handleSubmit}>
          {/* Form inputs */}
        </form>
        <ul className="list-group mt-3">
          {homework.map((hw) => (
            <li key={hw.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <h5>{hw.assignment}</h5>
                <p>{hw.description}</p>
              </div>
              <div>
                <p>Due Date: {hw.dueDate}</p>
                <p>Priority: {hw.priority}</p>
                <button className="btn btn-danger" onClick={() => deleteHomework(hw.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

     
  
    </div>
  );
};

export default SubjectComponent;


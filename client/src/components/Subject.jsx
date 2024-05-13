import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

function Subject() {
 
  const {subject, subjectId} = useParams();
  // console.log('THIS IS MY SUBJECT',subject);
  // console.log('THIS IS MY SUBJECTID',subjectId);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const teacher = searchParams.get('teacher');
  const studentId = searchParams.get('studentId'); // Extract studentId from query params
  // console.log(teacher);
    
  const [homework, setHomework] = useState([]);

  const [newHomework, setNewHomework] = useState({
    assignment: '',
    description: '',
    dueDate: '',
    priority: '',
    completed: false,
    pastdue: false,
  });
 const [selectedFile, setSelectedFile] = useState(null);
 const [images, setImages] = useState([]);
 const [homeworkId, setHomeworkId] = useState(null);
 const [showUpload, setShowUpload] = useState(false);
  const [homeworkCompleted, setHomeworkCompleted] = useState({});


  useEffect(() => {
    // Fetch homework data for the subject
    const fetchHomeworkForSubject = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/homework/subjects/${subjectId}/students/1/homework`, {
          headers: {
            authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
    // console.log('THIS IS MY RESPONSE',response);
        setHomework(response.data.data); // Update state with fetched homework data
      } catch (error) {
        console.error('Error fetching homework data:', error);
      }
    };

    fetchHomeworkForSubject(); // Call the fetch function
    // getImages(); // calling the getImages function to fetch images
  }, [subjectId]); // Run effect when subjectId changes

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

  const deleteHomework = async (homeworkId) => {
    console.log('THIS IS MY homeworkId:', homeworkId); 
    try {
      // Make a DELETE request to the backend endpoint
      await axios.delete(`localhost:4000/homeworks/${homeworkId}`);
      // If the request is successful, remove the homework assignment from the local state
      setHomework(homework.filter(hw => hw.id !== homeworkId));
      console.log('Homework assignment deleted successfully');
    } catch (error) {
      console.error('Error deleting homework:', error);
      // Handle errors, e.g., display an error message to the user
    }
  };
  //This function is for helping to update completed in the database, when homework is uploaded.
  //I need to complete the coding for uploading homework. The homework upload will trigger the function
  //to change homework.completed to true in the database.
  const handleCheckboxClick = (id) => {
    // Implement the logic to handle checkbox click event
    setHomeworkId(id);
    setShowUpload(true);
    console.log(`Checkbox with ID ${id} clicked`);
  };
  async function getImages() {
    try {
      const res = await axios.get("/api/images");
      setImages(res.data);
    } catch (err) {
      console.log(err);
    }
  }
  
  const onFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const onFileUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('imagefile', selectedFile, selectedFile.name);
      formData.append('studentId', studentId);
      formData.append('homeworkId', homeworkId);

console.log('THIS IS MY FORMDATA',formData);

      const response = await axios.post('/api/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
console.log('THIS IS MY RESPONSE',response);
console.log('Image uploaded:', response.data);
     
      setHomeworkCompleted((prevState) => ({
        ...prevState,
        [homeworkId]: true,
      }));
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div>
      <Link to="/dashboard">
        <button className="home-rounded-button">HOME</button>
      </Link>
      <div className="container">
      <h2>{subject} Component</h2>
      <p>Your {subject} teacher is:</p>
      <p>{teacher}</p>
        <div className="container">
        <h1 className="text-primary">Homework Tracker</h1>
      </div>
       
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
                <p>
                 Completed: 
                 <input
                 type="checkbox"
                 checked={homeworkCompleted[hw.id] || hw.completed} 
                 onClick={() => handleCheckboxClick(hw.id)} // This line of code will be for the homework upload Feature Extension.
                 //Call function insdie handleCheckbox click when the checkbox value changes
                 />
                </p>
                {showUpload && hw.id === homeworkId && (
                <div>
              <h3>Select homework to upload:</h3>
              <input type="file" onChange={onFileChange} />
              <button onClick={onFileUpload}>Upload</button>
              {/* I will add code here to display mini preview of uploaded images */}
              </div>
                )}
                <button className="btn btn-danger" onClick={() => deleteHomework(hw.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

     
  
    </div>
  );
};

export default Subject;
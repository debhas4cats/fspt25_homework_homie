import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../App.css';



function Subject({ studentId }) {
 
  const {subject, subjectId} = useParams();
  // console.log('THIS IS MY SUBJECT',subject);
  // console.log('THIS IS MY SUBJECTID',subjectId);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const teacher = searchParams.get('teacher');
  // console.log('studentId:', studentId); // Check the value of studentId
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
        const response = await axios.get(`http://localhost:4000/homework/subjects/${subjectId}/students/${studentId}/homework`, { // Use studentId
          headers: {
            authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        // console.log('Fetched Homework Data:', response.data); // Logging the fetched data
        setHomework(response.data.data); // Update state with fetched homework data
      } catch (error) {
        console.error('Error fetching homework data:', error);
      }
    };

    fetchHomeworkForSubject(); // Call the fetch function
    // getImages(); // calling the getImages function to fetch images
  }, [subjectId, studentId]); // Run effect when subjectId changes

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
  
      const response = await axios.post(`/api/images/${homeworkId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem("token")}`, // Add authorization header if needed
        },
      });
  
      // Ensure that response.data contains the image data
      if (response.data && response.data.length > 0) {
        // Assuming response.data is an array of image objects
        const newImages = response.data.map(image => ({
          id: image.id, // Assuming you have an id in your image object
          src: `http://localhost:4000/img/${image.imagefile}`, // Adjust the src according to your data structure
          alt: "Uploaded"
        }));
        console.log(newImages)
        
        // Update the state to include the new images
        setImages([...images, ...newImages]);
  
        // Update the state to indicate that the homework is completed
        setHomeworkCompleted(prevState => ({
          ...prevState,
          [homeworkId]: true,
        }));
        
        console.log('Images uploaded:', newImages);
      } else {
        console.error('No image data received in the response');
      }
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
      <div className='subject-title-outer-container'>
        <div className='subject-title-container'>
          <h2>{subject} Homework Tracker</h2>
          <p>{teacher} is your {subject} teacher.</p>
        </div>
      </div>
      
      <table className="homework-table-container">
        <thead className='header-container'>
            <tr>
              <th className="header">Assignment</th>
              <th className="header">Description</th>
              <th className="header">Due Date</th>
              <th className="header">Priority</th>
              <th className="header">Completed</th>
              <th className="header">Actions</th>
            </tr>
          </thead>
        <tbody>
          {homework
            .slice() // Create a shallow copy of the original array
            .sort((a, b) => new Date(a.due_date) - new Date(b.due_date)) // Sort the copied array by due date
            .map((hw) => (
              <tr key={hw.id}>
                <td>
                  <div className="table-cell">{hw.assignment}</div>
                </td>
                <td>
                  <div className="table-cell">{hw.description}</div>
                </td>
                <td>
                  <div className="table-cell">{new Date(hw.due_date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}</div>
                </td>
                <td>
                  <div className="table-cell">{hw.priority}</div>
                </td>
                  <td className="center-cell">
                    <div className="table-checkbox-cell">
                      <input
                        type="checkbox"
                        checked={homeworkCompleted[hw.id] || hw.completed}
                        onChange={() => handleCheckboxClick(hw.id)}
                      />
                    </div>
                  </td>
                  <td>
                    <div className="table-cell">
                      {showUpload && hw.id === homeworkId && (
                        <div>
                          <p>Select homework to upload:</p>
                          <input type="file" onChange={onFileChange} />
                          <button onClick={onFileUpload}>Upload</button>
                          {/* Displaying uploaded images */}
                          <div className='homework-image'>
                            {images.map(img => {
                              console.log('Image URL:', `http://localhost:4000/img/${img.imagefile}`);
                              return (
                                <img key={img.id} src={`http://localhost:4000/img/${img.imagefile}`} alt="Uploaded" />
                              );
                            })}
                          </div>

                        </div>
                      )}
                      <button className="btn btn-danger" onClick={() => deleteHomework(hw.id)}>Delete</button>
                    </div>
                  </td>
              </tr>
            ))}
        </tbody>

      </table>
    </div>
  </div>
  );
}

export default Subject;
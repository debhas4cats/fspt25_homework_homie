import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../App.css';



function Subject({ studentId }) {

  const [teacherId, setTeacherId] = useState([
    { subject: "Mathematics", id: 1 },
    { subject: "Science", id: 2 },
    { subject: "German", id: 1 },
    { subject: "History", id: 2 },
    { subject: "Art", id: 3 },
    { subject: "English", id: 4 }
  ]);
  
  // const [subject, setSubject] = useState('');
  const [assignment, setAssignment] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [priority, setPriority] = useState('');

 
  const {subject, subjectId} = useParams();
  // console.log('THIS IS MY SUBJECT',subject);
  // console.log('THIS IS MY SUBJECTID',subjectId);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const teacher = searchParams.get('teacher');

  // const { studentId } = useParams();
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

  const handleDueDateChange = (event) => {
    const inputDate = event.target.value;
    // Here you can implement your logic to validate the due date
    // For now, let’s just update the due date without validation
    setDueDate(inputDate);
    setErrorMessage('');
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Find the teacherId based on the selected subject
  const selectedSubject = teacherId.find(item => item.subject === subject);
  const teacherIdToSend = selectedSubject ? selectedSubject.id : null;
  
    try {
      // Make the POST request to add homework
      const response = await axios.post('http://localhost:4000/homework', {
        assignment: assignment,
        description: description,
        due_date: dueDate,
        priority: priority,
        studentId: studentId,
        subjectId: parseInt(subjectId), // Parse subjectId to integer
        teacherId: teacherIdToSend
      });
    
      // Check if homework was successfully added
      if (response.status === 201) {
        console.log("Homework submitted successfully.");
        
        // Fetch the updated homework list after adding new homework
        const updatedHomeworkResponse = await axios.get(`http://localhost:4000/homework/subjects/${subjectId}/students/${studentId}/homework`, {
          headers: {
            authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
  
        // Update the homework state with the new data
        setHomework(updatedHomeworkResponse.data.data);
        
        // Clear the input fields
        setAssignment('');
        setDescription('');
        setDueDate('');
        setPriority('');
        setErrorMessage('');
      } else {
        console.error('Failed to submit homework');
      }
    } catch (error) {
      console.error('Error submitting homework:', error);
      setErrorMessage('Failed to submit homework');
    }
  };
  
  const deleteHomework = async (homeworkId) => {
    console.log('THIS IS MY homeworkId:', homeworkId); 
    try {
      // Make a DELETE request to the backend endpoint
      await axios.delete(`http://localhost:4000/homework/homeworks/${homeworkId}`);
      // If the request is successful, remove the homework assignment from the local state
      setHomework(homework.filter(hw => hw.id !== homeworkId));
      console.log('Homework assignment deleted successfully');
    } catch (error) {
      console.error('Error deleting homework:', error);
      // Handle errors, e.g., display an error message to the user
    }
  };

  useEffect(() => {
    // Fetch homework data for the subject
    const fetchHomeworkForSubject = async () => {
    };
  
    fetchHomeworkForSubject(); // Call the fetch function
    getImages(); // Call the function to fetch images
  }, [subjectId, studentId]);
  
  
    //This function is for helping to update completed in the database, when homework is uploaded.
  //I need to complete the coding for uploading homework. The homework upload will trigger the function
  //to change homework.completed to true in the database.
  const handleCheckboxClick = (id) => {
    // Implement the logic to handle checkbox click event
    setHomeworkId(id);
    setShowUpload(true);
    console.log(`Checkbox with ID ${id} clicked`);
      // Reset images state when a new homework is selected
  setImages([]);
  };
  
  async function getImages() {
    try {
      const res = await axios.get("/api/images");
      console.log("Images data from backend:", res.data); // Log the received images data
      setImages(res.data); // Assuming res.data is an array of image objects with correct structure
    } catch (err) {
      console.log(err);
    }
  }

  const onFileChange = (event) => {
    setSelectedFile(event.target.files[0]); // Update selected file
  };

  const clearFileInput = () => {
    // Clear the file input by setting selectedFile to null
    setSelectedFile(null);
  };
  
  const onFileUpload = async () => {
    if (!selectedFile || !homeworkId) { // Check if homeworkId is set
        console.error('No file selected or homeworkId not set');
        return;
    }

    try {
        const formData = new FormData();
        formData.append('imagefile', selectedFile, selectedFile.name);
        formData.append('studentId', studentId);
        formData.append('homeworkId', homeworkId);

        // Log the form data
        console.log('Form Data:', Object.fromEntries(formData.entries())); // Convert FormData to plain object and log

        // Log the URL with appended homeworkId
        const uploadUrl = `http://localhost:4000/api/images/${homeworkId}`;
        console.log("Upload URL:", uploadUrl);

        const response = await axios.post(uploadUrl, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${localStorage.getItem("token")}`,
            },
        });

        if (response.data) {
            console.log("Response data:", response.data); // Log the response data

            // Extract the filenames from the response data
            const uploadedFilenames = response.data.map(item => {
                if (item && item.image_data) {
                    // Convert the array to a Uint8Array and then to a string
                    const filename = new TextDecoder().decode(new Uint8Array(item.image_data.data));
                    return filename;
                } else {
                    console.error("Error: imagefile not found in response data");
                    return null; // or any other default value
                }
            });

            // Log the uploaded filenames
            console.log("Uploaded filenames:", uploadedFilenames);

            // Iterate over the uploaded filenames
            uploadedFilenames.forEach((uploadedFilename, index) => {
                // Create new image object for each uploaded filename
                const newImage = {
                    id: index + 1, // or you might have another way to generate the ID
                    src: uploadedFilename ? `http://localhost:4000/img/${uploadedFilename}` : "",
                    alt: "Uploaded"
                };

                // Log the new image object
                console.log("New image:", newImage);

                // Update the images state with the new image
                setImages(prevImages => [...prevImages, newImage]);
            });

            // Update homework completed state
            setHomeworkCompleted(prevState => ({
                ...prevState,
                [homeworkId]: true,
            }));
        }

        clearFileInput();
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

        <div className='homework-add-form'>
          <form onSubmit={handleSubmit}>
            <label>
              Assignment:
              <input type="text" value={assignment} onChange={(e) => setAssignment(e.target.value)} className="input-field" />
            </label>
            <label>
              Description:
              <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="input-field" />
            </label>
            <label>
              Due Date:
              <input type="text" value={dueDate} onChange={handleDueDateChange} className="input-field" />
            </label>
            <span style={{ color: 'red' }}>{errorMessage}</span>
            <label>
              Priority:
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="input-field"
              >
                <option value="">Select Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </label>
            <button type="submit" className='homework-submit'>Add Homework</button>
          </form>
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
            .slice()
            .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
            .map((hw) => ( // Remove index parameter
              <tr key={hw.id}> {/* Use hw.id as the key */}
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
          {images
            .filter(image => image.homework_id === homeworkId) // Filter images for the current homework
            .map(image => (
              <img key={image.image_id} src={`http://localhost:4000/img/${image.filename}`} alt={image.alt} />
            ))}
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
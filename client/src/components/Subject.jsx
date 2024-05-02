import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../App.css';
function SubjectComponent() {
  const [homework, setHomework] = useState([]);
  const [newHomework, setNewHomework] = useState({
    assignment: '',
    description: '',
    dueDate: '',
    priority: '',
    completed: false,
    pastdue: false,
  });
  const { subject } = useParams(); // Accessing subject ID from URL params

  useEffect(() => {
    fetchHomeworkForSubject();
  }, [subject]); // Fetch homework whenever subject changes

  async function fetchHomeworkForSubject() {
    try {
      const response = await fetch(`http://localhost:4000/homework/subjects/${subject.id}/students/${student.id}/homework`);
      if (!response.ok) {
        throw new Error(`Failed to fetch homework data for ${subject}`);
      }
      const data = await response.json();
      console.log(data);
      setHomework(data.data);
    } catch (error) {
      console.error(error);
  };}
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewHomework({ ...newHomework, [name]: value });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Newhomework:', newHomework);
    // Logic to add new homework
    // You can send a POST request to your API with newHomework data
    // Reset form fields after submission
    setNewHomework({
      assignment: '',
      description: '',
      dueDate: '',
      priority: '',
      completed: false,
      pastdue: false,
    });
  };
  const deleteHomework = async (id) => {
    console.log('Deleting homework with ID:', id);
    try {
      const response = await fetch(`http://localhost:4000/homework/homeworks/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete homework');
      }
      // Remove the deleted homework from the state
      setHomework(homework.filter(hw => hw.id !== id));
    } catch (error) {
      console.error('Error deleting homework:', error);
    }
  };

  return (
    <div>
      <Link to="/dashboard">
        <button className="home-rounded-button">HOME</button>
      </Link>

      <h2>{subject} Component</h2>
      <p>Teacher name</p>
      <p>{subject}</p>
      <div className="container">
        <h1 className="text-primary">Homework Tracker</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="assignment">Assignment</label>
            <input
              type="text"
              className="form-control"
              id="assignment"
              name="assignment"
              value={newHomework.assignment}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <input
              type="text"
              className="form-control"
              id="description"
              name="description"
              value={newHomework.description}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="dueDate">Due Date</label>
            <input
              type="date"
              className="form-control"
              id="dueDate"
              name="dueDate"
              value={newHomework.dueDate}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select
              className="form-control"
              id="priority"
              name="priority"
              value={newHomework.priority}
              onChange={handleInputChange}
            >
              <option value="">Select Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="form-group">
  <label htmlFor="priority">Priority</label>
  <select
    className="form-control"
    id="priority"
    name="priority"
    value={newHomework.priority}
    onChange={handleInputChange}
  >
    <option value="">Select Priority</option>
    <option value="low">Low</option>
    <option value="medium">Medium</option>
    <option value="high">High</option>
  </select>
</div>

{/* Add the completed and pastdue fields here */}
<div className="form-check">
  <input
    type="checkbox"
    className="form-check-input"
    id="completed"
    name="completed"
    checked={newHomework.completed}
    onChange={handleInputChange}
  />
  <label className="form-check-label" htmlFor="completed">Completed</label>
</div>
<div className="form-check">
  <input
    type="checkbox"
    className="form-check-input"
    id="pastdue"
    name="pastdue"
    checked={newHomework.pastdue}
    onChange={handleInputChange}
  />
  <label className="form-check-label" htmlFor="pastdue">Past Due</label>
</div>
          {/* Add more fields here */}
          <button type="submit" className="btn btn-primary">Add Homework</button>
        </form>
      </div>
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
          
              {/* Other details */}
              <button className="btn btn-danger" onClick={() => deleteHomework(hw.id)}>Delete</button>
              {/* Other buttons */}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
} 

// PropTypes definition (if you're using PropTypes)
SubjectComponent.propTypes = {
  // Define your PropTypes here
};

export default SubjectComponent;

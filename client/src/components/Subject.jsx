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
    completed: '',
    pastdue: '',
  });
  const { subject } = useParams();

  useEffect(() => {
    fetchHomeworkForSubject(subject);
  }, [subject]);

  async function fetchHomeworkForSubject(subjectId) {
    try {
      const response = await fetch(`/api/subjects/${subjectId}/homework`);
      const data = await response.json();
      setHomework(data);
    } catch (error) {
      console.error(error);
    }
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewHomework({ ...newHomework, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Newhomework:', newHomework);
    // Logic to add new homework
    // You can send a POST request to your API with newHomework data
  };
  const deleteHomework = (id) => {
    console.log('Deleting homework with ID:', id);
    // Logic to delete homework with the specified ID
  };

  return (
    <div>
      <Link to="/">
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
            <label htmlFor="duedate">Due Date</label>
            <input
              type="text"
              className="form-control"
              id="duedate"
              name="dueDate"
              value={newHomework.dueDate}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <input
              type="text"
              className="form-control"
              id="priority"
              name="priority"
              value={newHomework.priority}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="completed">Completed</label>
            <input
              type="text"
              className="form-control"
              id="completed"
              name="completed"
              value={newHomework.completed}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="pastdue">Past Due</label>
            <input
              type="text"
              className="form-control"
              id="pastdue"
              name="pastdue"
              value={newHomework.pastdue}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit" className="btn btn-primary">Add Homework</button>
        </form>
      </div>
      <ul className="list-group mt-3">
        {homework.map((hw) => (
          <li key={hw.id} className="list-group-item d-flex">
            <div className="d-flex w-100 justify-content-between">
              <h5 className="mb-1">{hw.assignment}</h5>
              <small>{hw.description}</small>
            </div>
            <div className="d-flex w-100 justify-content-between">
              <small>{hw.dueDate}</small>
              <small>{hw.priority}</small>
              <small>{hw.completed}</small>
              <small>{hw.pastdue}</small>
              <button className="btn btn-danger" onClick={() => deleteHomework(hw.id)}>Delete</button>
              <button className="btn btn-success">Edit</button>
              <button className="btn btn-primary">View</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SubjectComponent;

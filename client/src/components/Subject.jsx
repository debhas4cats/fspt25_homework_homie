import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../App.css';

function SubjectComponent() {
  const [homework, setHomework] = useState([]);
  const { subject } = useParams();

  useEffect(() => {
  },[]);

  const getHomeworks = () => {
    fetch(`/api/homeworks?subject=${subject}`)
      .then((res) => res.json())
      .then((homeworks) => {
        setHomeworks(homeworks);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewHomework({ ...newHomework, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Logic to add new homework
    // You can send a POST request to your API with newHomework data
    console.log('New homework:', newHomework);
  };

  const deleteHomework = (id) => {
    // Logic to delete homework with the specified ID
    console.log('Deleting homework with ID:', id);
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
              value={homework.assignment}
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
              value={homework.description}
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
              value={homework.dueDate}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit" className="btn btn-primary">Add Homework</button>
        </form>
      </div>
      <ul className="list-group">
        {homework.map((homework) => (
          <li className="list-group-item" key={homework.id}>
            {homework.assignment}
            <button onClick={() => deleteHomework(homework.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SubjectComponent;
// const HOMEWORK_INITIAL_STATE = {
//   assignment: '',
//   description: '',
//   dueDate: '', // Corrected typo
// };
  // const [newHomework, setNewHomework] = useState(HOMEWORK_INITIAL_STATE);
  // const [editHomework, setEditHomework] = useState(null);
  // Define functions outside of getHomeworks
  

  

  

  // const addHomework = async () => {
  //   try {
  //     const response = await fetch('/api/homeworks', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify(newHomework)
  //     });
  //     const homeworks = await response.json();
  //     setHomework(homeworks);
  //     setNewHomework(HOMEWORK_INITIAL_STATE);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // const handleHomeworkSelect = async id => {
  //   try {
  //     const response = await fetch(`/api/homeworks/${id}`);
  //     const homework = await response.json();
  //     setEditHomework(homework);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // const updateHomework = async () => {
  //   try {
  //     const response = await fetch(`/api/homeworks/${editHomework.id}`, {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify(editHomework)
  //     });
  //     const homeworks = await response.json();
  //     setHomework(homeworks);
  //     setEditHomework(null);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // const deleteHomework = async id => {
  //   try {
  //     const response = await fetch(`/api/homeworks/${id}`, {
  //       method: 'DELETE'
  //     });
  //     const homeworks = await response.json();
  //     setHomework(homeworks);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
    // const handleInputChange = event => {
  //   const { name, value } = event.target;
  //   setHomework(prevState => ({ ...prevState, [name]: value }));
  // };

  //  const handleSubmit = event => {
  //   event.preventDefault();
  //   addhomework();
  // };
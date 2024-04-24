import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './App.css';

function Dashboard() {
  const [subjects, setSubjects] = useState([
    { id: 1, name: "Math", assignments: [] },
    { id: 2, name: "Science", assignments: [] },
    { id: 3, name: "History", assignments: [] },
    { id: 4, name: "German", assignments: [] },
    { id: 5, name: "English", assignments: [] },
    { id: 6, name: "Art", assignments: [] }
  ]);

  useEffect(() => {
    // Fetch homework data for all subjects
    Promise.all(subjects.map(subject =>
      fetch(`http://localhost:5000/homework/subjects/${subject.id}/homework`)
        .then(response => response.json())
        .then(data => {
          // Update subjects with fetched assignments
          setSubjects(prevSubjects => {
            const updatedSubjects = prevSubjects.map(prevSubject => {
              if (prevSubject.id === subject.id) {
                return { ...prevSubject, assignments: data.data };
              }
              return prevSubject;
            });
            return updatedSubjects;
          });
        })
        .catch(error => console.error('Error fetching homework data:', error))
    ));
  }, []); // Empty dependency array to fetch data only once on component mount

  return (
    <div>
      <div className="title-and-button-container">
        <div className='title-container'>
          <h1 className='title'>
            <span>HOMEWORK</span>
            <span>HOMIE</span>
          </h1>
        </div>
      </div>

      <div className="homework-container">
        {subjects.map(subject => (
          <div key={subject.id} className="assignment-container">
            <Link to={`/${subject.name.toLowerCase()}`} className="rounded-button">{subject.name}</Link>
            <ul>
              {subject.assignments
                .slice()
                .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
                .map((assignment, index) => (
                  <li key={index}>
                    <h3>{assignment.assignment}</h3>
                    <p className="assignment-due">Due: {new Date(assignment.due_date).toLocaleDateString()}</p>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Dashboard;

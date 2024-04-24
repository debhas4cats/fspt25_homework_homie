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
  //This initializes a state variable subjects using the useState hook.
  // The initial state is an array of subject objects with empty assignments.

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
  }, []); //fetch data only once on component mount

  return (
    <div>
      <div className='outer-title-container'>
        <div className='title-container'>
          <h1 className='title'>
            <span>HOMEWORK</span>
            <span>HOMIE</span>
          </h1>
          </div>
        </div>
     
       
          {/*  display a title, and for each subject, 
              create a container showing the subject's name as a link 
              and a list of assignments sorted by due date */}
            <div className="homework-container">
              {subjects.map(subject => ( //map through each subject in the subjects array and render content for each subject
              // make a container for each subject's assignments
                <div key={subject.id} className="assignment-container"> 
                {/*  create a link to a page related to the subject
                the to prop of Link component is set to /${subject.name.toLowerCase()}
                  which will navigate to a route based on the subject name in lowercase because
                  converting the subject name to lowercase, ensures that the URL will be consistent and predictable
                  The subject name is displayed as button text. */}
                  <Link to={`/${subject.name.toLowerCase()}`} className="rounded-button">{subject.name}</Link>
                  {/* create an unordered list where assignments will be displayed */}
                  <ul>
                    {/*  iterate through each assignment for the subject
                      and sort the assignments by their due date and map them into list elements. */}
                    {subject.assignments
                      .slice() //create a shallow copy of the assignments array
                      .sort((a, b) => new Date(a.due_date) - new Date(b.due_date)) // sort assignments by due date
                      .slice(0, 3) // Limit the list to the first 3 items
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

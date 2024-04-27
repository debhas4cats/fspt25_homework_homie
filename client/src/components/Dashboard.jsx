import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import createMessage from '../utilities/createMessage'; // Import the createMessage function

function Dashboard() {
  
  const [subjects, setSubjects] = useState([
    { id: 1, name: "Math", assignments: null },
    { id: 2, name: "Science", assignments: null },
    { id: 3, name: "History", assignments: null },
    { id: 4, name: "German", assignments: null },
    { id: 5, name: "English", assignments: null },
    { id: 6, name: "Art", assignments: null }
  ]);
    // State to track whether the floating div should be shown
    const [showFloatingDiv, setShowFloatingDiv] = useState(false);
    // State to store the assignment data for the floating div
    const [hoveredAssignment, setHoveredAssignment] = useState(null);
  //This initializes a state variable subjects using the useState hook.
  // The initial state is an array of subject objects as NULL.

  useEffect(() => {
    const fetchData = async () => { // use async/await to fetch data for each subject
      try {
        const promises = subjects.map(async subject => { // loop through each subject 
          const response = await fetch(`http://localhost:5000/homework/subjects/${subject.id}/homework`); // for each subject we fetch homework data 
          if (!response.ok) { // if the response from the server is not okay -- we throw an error to handle
            throw new Error(`Failed to fetch homework data for ${subject.name}`);
          }
          const data = await response.json(); //waits for response from the server to be fully fetched and parsed as JSON and store as variable DATA
          return { subjectId: subject.id, data: data.data }; // create an object that associates a subject's ID with its corresponding homework data. 
        });
         // after fetching data from all subjects, we gather them
         //and ALL SETTLED allows us to wait for all promises to resolve or reject
         // store the results of the promises in a variable called results
        const results = await Promise.allSettled(promises); 
       
        //update the state of subjects using SETSUBJECTS
        setSubjects(prevSubjects => { //loop through each subject in the previous state
          return prevSubjects.map(prevSubject => { 
            //find its corresponding results in the RESULTS
            const result = results.find(result => result.value && result.value.subjectId === prevSubject.id);
            // if we find a result for the subject and it's VALID
            if (result && result.value && result.value.data) {
              // if VALID, update the subjects assignment with that data
              // if there's no result or the result does have data, keep the subject unchanged
              return { ...prevSubject, assignments: result.value.data };
            }
            return prevSubject;
          });
        });
      } catch (error) {
        console.error('Error fetching homework data:', error);
        //  if an error occurs, log it to the console 
      }
    };
  
    fetchData(); //call fetchData() when the component mounts 
  }, []); //second argument of useEffect means it will only run once on mount
  


  return (
    <div className='outer-container'>
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
                    {subject.assignments && subject.assignments.length > 0 && (
                      subject.assignments
                        .slice()
                        .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
                        .slice(0, 3)
                        .map((assignment, index) => (
                          <li
                            className="assignment-message"
                            key={index}
                            onMouseEnter={() => {
                              setHoveredAssignment(assignment);
                              setShowFloatingDiv(true);
                            }}
                            onMouseLeave={() => setShowFloatingDiv(false)}
                          >
                            {createMessage([assignment])}
                          </li>
                        ))
                    )}
                </ul>
                 
                </div>
              ))}
              </div>

              <div className='floating-div-outer-container'>
                {/* Floating div */}
                  {showFloatingDiv && hoveredAssignment && (
                    <div className="floating-div">
                      <h3>{hoveredAssignment.assignment}</h3>
                      <p>{hoveredAssignment.description}</p>
                      <p>Teacher: {hoveredAssignment.teacher_name}</p>
                      <p className="assignment-due">Due: {new Date(hoveredAssignment.due_date).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
     

    </div>
  );
}


export default Dashboard;

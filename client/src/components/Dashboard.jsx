import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function Dashboard() {
  
  const [subjects, setSubjects] = useState([
    { id: 1, name: "Math", assignments: null },
    { id: 2, name: "Science", assignments: null },
    { id: 3, name: "History", assignments: null },
    { id: 4, name: "German", assignments: null },
    { id: 5, name: "English", assignments: null },
    { id: 6, name: "Art", assignments: null }
  ]);
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
         //and ALL SETLLED allows us to wait for all promises to resolve or reject
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
                      and sort the assignments by their due date and map them into list elements.
                      first check if the assignments are not null
                      2nd check if assignments has items */}
                  {subject.assignments !== null ? ( 
                    subject.assignments.length > 0 ? (
                      subject.assignments
                      .slice() //create a shallow copy of the assignments array
                      .sort((a, b) => new Date(a.due_date) - new Date(b.due_date)) // sort assignments by due date
                      .slice(0, 3) // Limit the list to the first 3 items
                      .map((assignment, index) => ( // map through subjects and process the position of assignment and create list
                        <li key={index}>
                          {/* the KEY attribute ensures that index is unique for each item in the array for managing and updating the list */}
                          <h3>{assignment.assignment}</h3> 
                          {/* <h3>{assignment.description}</h3>  */}
                          <p className="assignment-due">Due: {new Date(assignment.due_date).toLocaleDateString()}</p>
                        </li>
                      ))
                      ) : (
                        <li> No assignments </li> //add a message for subjects with no assignments
                      )
                    ) : (
                      <li>Loading...</li>
                    )}
                  </ul>
                </div>
              ))}
              </div>
     

    </div>
  );
}

export default Dashboard;

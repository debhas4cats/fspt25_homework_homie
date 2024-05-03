import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import createMessage from "../utilities/createMessage"; // Import the createMessage function

function Dashboard() {
  // const [subjects, setSubjects] = useState([
  //    { id: 1, name: "Math", assignments: null },
  //    { id: 2, name: "Science", assignments: null },
  //   { id: 3, name: "History", assignments: null },
  //   { id: 4, name: "German", assignments: null },
  //   { id: 5, name: "English", assignments: null },
  //    { id: 6, name: "Art", assignments: null },
  //  ]);
  // State to track whether the floating div should be shown
  const [showFloatingDiv, setShowFloatingDiv] = useState(false);
  // State to store the assignment data for the floating div
  const [hoveredAssignment, setHoveredAssignment] = useState(null);
  //This initializes a state variable subjects using the useState hook.
  // The initial state is an array of subject objects as NULL.
  const [forceRender, setForceRender] = useState(0); // Initialize forceRender state variable
//refactoring the subjects state variable to take in the data from the GET subjects endpoint
const [subjects, setSubjects] = useState([]);

useEffect(() => {
  // Fetch subjects data from backend
  const fetchSubjectsData = async () => {
    try {
      const response = await fetch("http://localhost:4000/homework/subjects");
// console.log('THIS IS MY RESPONSE', response)
      if (!response.ok) {
        throw new Error("Failed to fetch subjects");
      }
      const responseData = await response.json();
      // if (!Array.isArray(responseData.data)) {
      //   throw new Error("Data is not an array");
      // }
// console.log('THIS IS MY RESPONSEDATA', responseData)
      const data =  responseData.data.data; // Access data.data
// console.log('THIS IS MY DATA', data)
      // Map over the fetched subjects and initialize the subjects state
      setSubjects(data.map(subject => ({
        id: subject.subjectID, // Assuming subjectID is the ID of the subject
        name: subject.subject_name,
        teacher: `${subject.firstname} ${subject.lastname}`, // Combine first and last name
        assignments: null // Initially set assignments to null
      })));
      // console.log('Updated subjects state:', subjects);
   
    } catch (error) {
console.error("Error fetching subjects:", error);
    }
  };

  fetchSubjectsData();
}, []);

//this useEffect is to correct the rendering glitch. It will log subjects whenever a change is made to the subjects state variable.
// useEffect(() => {
//   // console.log("Updated subjects state in 2nd UseEffect:", subjects);
// }, [subjects]);

  useEffect(() => {
    const fetchData = async () => {
      // use async/await to fetch data for each subject
      try {
        const promises = subjects.map(async (subject) => {
          // loop through each subject
          const response = await fetch(
            `http://localhost:4000/homework/subjects/${subject.id}/students/1/homework`
          ); // for each subject we fetch homework data
          if (!response.ok) {
            // if the response from the server is not okay -- we throw an error to handle
            throw new Error(
              `Failed to fetch homework data for ${subject.name}`
            );
          }
          const data = await response.json(); //waits for response from the server to be fully fetched and parsed as JSON and store as variable DATA
          // console.log(`Homework data for ${subject.name}:`, data); // console logging the data received just in case
          return { subjectId: subject.id, data: data.data }; // create an object that associates a subject's ID with its corresponding homework data.
        });
        // after fetching data from all subjects, we gather them
        //and ALL SETTLED allows us to wait for all promises to resolve or reject
        // store the results of the promises in a variable called results
        const results = await Promise.allSettled(promises);
console.log('THIS IS MY RESULTS', results)
        //update the state of subjects using SETSUBJECTS
        setSubjects((prevSubjects) => {
          //loop through each subject in the previous state
          return prevSubjects.map((prevSubject) => {
            //find its corresponding results in the RESULTS
            const result = results.find(
              (result) =>
                result.value && result.value.subjectId === prevSubject.id
            );
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
        console.error("Error fetching homework data:", error);
        //  if an error occurs, log it to the console
      }
    };

    fetchData(); //call fetchData() when the component mounts
  }, []); //second argument of useEffect means it will only run once on mount

  const tallyAssignments = () => {
    // keep track of how many assignments fall into each category
    let lateCount = 0;
    let todayCount = 0;
    let tomorrowCount = 0;

    //get today's date using new Date()
    //set the time for today to midnight, so it's exactly at the start of the day
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to midnight

    //// set up tomorrow's date by copying today's date and adding 1 day to it
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // go through each subject
    // for each subject, check if it has any assignments
    // if there are assignments, go through each assignment
    // for each assignment, create a due date object based on its due_date
    // set the time for the due date to midnight, so we're only comparing dates
    subjects.forEach((subject) => {
      if (subject.assignments) {
        subject.assignments.forEach((assignment) => {
          const dueDate = new Date(assignment.due_date);
          dueDate.setHours(0, 0, 0, 0); // Set time to midnight

          // compare the due date with today and tomorrow to figure out if it's late, due today, or due tomorrow.
          // if the due date is before today, it's late, so increase lateCount
          // if it's the same as today, increase todayCount.
          // if it's the same as tomorrow, increase tomorrowCount

          if (dueDate < today) {
            lateCount++;
          } else if (dueDate.getTime() === today.getTime()) {
            todayCount++;
          } else if (dueDate.getTime() === tomorrow.getTime()) {
            tomorrowCount++;
          }
        });
      }
    });
    // return an object containing the counts for late, today, and tomorrow assignments
    return { lateCount, todayCount, tomorrowCount };
  };
  //outside the function, take the properties lateCount, todayCount, and tomorrowCount from the object
  //returned by tallyAssignments() and assign them to variables with the same names
  const { lateCount, todayCount, tomorrowCount } = tallyAssignments();

  return (
    <div className="outer-container">
      {/* display the tally of assignments that are late, due today, due tomorrow */}
      <div className="assignment-scoreboard">
        <h2>Scoreboard:</h2>
        <div className="due-date">Late: {lateCount}</div>
        <div className="due-date">Due Today: {todayCount}</div>
        <div className="due-date">Due Tomorrow: {tomorrowCount}</div>
      </div>

      <div className="outer-title-container">
        <div className="title-container">
          <h1 className="title">
            <span>HOMEWORK</span>
            <span>HOMIE</span>
          </h1>
        </div>
      </div>

      {/*  display a title, and for each subject, 
              create a container showing the subject's name as a link 
              and a list of assignments sorted by due date */}
      <div className="homework-container">
        {/* line modified to take in the subjects from the useEffect to fetchSubjects and modify the useState for Subjects */}
        {subjects.map((subject, index) => (
  <div key={`${subject.id}_${index}`} className="assignment-container">
              {/*  create a link to a page related to the subject
                the to prop of Link component is set to /${subject.name.toLowerCase()}
                  which will navigate to a route based on the subject name in lowercase because
                  converting the subject name to lowercase, ensures that the URL will be consistent and predictable
                  The subject name is displayed as button text. */}
              <Link
                to={`/${subject.name}?teacher=${encodeURIComponent(subject.teacher)}`} // Pass teacher's name as a URL parameter
                className="rounded-button"
              >
                {subject.name}
              </Link>
              {/* create an unordered list where assignments will be displayed */}

              <ul>
                {subject.assignments &&
                  subject.assignments.length > 0 &&
                  subject.assignments
                    .slice()
                    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
                    .slice(0, 3)
                    .map((assignment, index) => (
                      <li
                        // li can have different styles based on whether the assignment is late or not
                        // if due date is in the past (is true), assigns the li class 'late'
                        // if due date is not in the past (is false) -- no additional li class will be added
                        className={`assignment-message ${
                          new Date(assignment.due_date) < new Date()
                            ? "late"
                            : ""
                        }`}
                        key={`${subject.id}_${index}`} // Use a unique key combining subject ID and index
                        onMouseEnter={() => {
                          setHoveredAssignment(assignment);
                          setShowFloatingDiv(true);
                        }}
                        onMouseLeave={() => setShowFloatingDiv(false)}
                      >
                        {createMessage([assignment])}
                      </li>
                    ))}
              </ul>
            </div>
          )
       ) }
      </div>

      {/* "post it" note containing details of assignment based on where user hovers */}
      <div className="floating-div-outer-container">
        {/* Floating div */}
        {showFloatingDiv && hoveredAssignment && (
          // floating div can have different styles based on whether the assignment is late or not
          // if due date is in the past (is true), assigns the div class 'late'
          // if due date is not in the past (is false) -- no additional div class will be added
          <div
            className={`floating-div ${
              new Date(hoveredAssignment.due_date) < new Date() ? "late" : ""
            }`}
          >
            <h3>{hoveredAssignment.assignment}</h3>
            <p>{hoveredAssignment.description}</p>
            <p>Teacher: {hoveredAssignment.teacher_name}</p>
            <p className="assignment-due">
              Due: {new Date(hoveredAssignment.due_date).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

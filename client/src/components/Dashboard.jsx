import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import createMessage from "../utilities/createMessage"; // Import the createMessage function
import axios from "axios";
import SubjectComponent from "./Subject";

function Dashboard() {
  // State to track whether the floating div should be shown
  const [showFloatingDiv, setShowFloatingDiv] = useState(false);
  // State to store the assignment data for the floating div
  const [hoveredAssignment, setHoveredAssignment] = useState(null);
  //This initializes a state variable subjects using the useState hook.
  // The initial state is an array of subject objects as NULL.

  //refactoring the subjects state variable to take in the data from the GET subjects endpoint
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    // Fetch subjects data from backend
    const fetchSubjectsData = async () => {
      try {
        const response = await fetch("http://localhost:4000/homework/subjects");
        if (!response.ok) {
          throw new Error("Failed to fetch subjects");
        }
        const responseData = await response.json();
        const data = responseData.data.data; // Access data.data
        console.log('This is the data', data)

        // Map over the fetched subjects and initialize the subjects state
        setSubjects(
          data.map((subject) => ({
            id: subject.subjectID, // Assuming subjectID is the ID of the subject
            name: subject.subject_name,
            teacher: `${subject.firstname} ${subject.lastname}`, // Combine first and last name
            assignments: null, // Initially set assignments to null
          }))
        );
        // Fetch homework data for each subject
        data.forEach((subject) => {
          getHomework(subject.subjectID);
        });
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };

    fetchSubjectsData();
  }, []);

  const getHomework = async (subjectId) => {
    // use async/await to fetch data for each subject
    try {
      const { data } = await axios(
        `http://localhost:4000/homework/subjects/${subjectId}/students/1/homework`,
        {
          headers: {
            authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      //update the state of subjects using SETSUBJECTS
      setSubjects((prevSubjects) => {
        //find the subject from the subjects state that matches the subject ID from the result and set the assignments to the data
        return prevSubjects.map((prevSubject) => {
          if (prevSubject.id === subjectId) {
            return { ...prevSubject, assignments: data.data };
          }
          return prevSubject;
        });
      });
    } catch (error) {
      console.error("Error fetching homework data:", error);
      //  if an error occurs, log it to the console
    }
  };

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
              to={`/${subject.name}?teacher=${encodeURIComponent(
                subject.teacher
              )}`} // Pass teacher's name as a URL parameter
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
                        new Date(assignment.due_date) < new Date() ? "late" : ""
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
        ))}
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
      <SubjectComponent />
    </div>
  );
}

export default Dashboard;

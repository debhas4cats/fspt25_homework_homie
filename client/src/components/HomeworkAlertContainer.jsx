import React, { useState } from "react";
import { Link } from "react-router-dom";
import createMessage from "../utilities/createMessage"; // Import the createMessage function
import "../App.css";

function HomeworkAlertContainer({ subjects }) {
  // State to track whether the floating div should be shown
  const [showFloatingDiv, setShowFloatingDiv] = useState(false);
  // State to store the assignment data for the floating div
  const [hoveredAssignment, setHoveredAssignment] = useState(null);
  //This initializes a state variable subjects using the useState hook.
  // The initial state is an array of subject objects as NULL.

  function isLate(dueDate) {
    const today = new Date(); //create a new date object representing the current date and time
    //check if the homework due date is earlier than the current date
    //if the due date is earlier than today, it means the assignment is late
    //then check if the due date is not the same as today because even if an assignment is due today -- it is not considered late because it's due at the end of the day
    return dueDate < today && !isSameDay(dueDate, today);
  }

  //function to compare dates but only caring about the day, ignoring the time part
  //if all three conditions are true, it means that both dates represent the same day -- else it returns false
  function isSameDay(date1, date2) {
    return (
      date1.getFullYear() === date2.getFullYear() && //year of date1 is the same as the year of date2
      date1.getMonth() === date2.getMonth() && //month of date1 is the same as the month of date2
      date1.getDate() === date2.getDate() // day of the month of date1 is the same as the day of the month of date2
    );
  }

  return (
    <div>
      {/*  display a title, and for each subject, 
            create a container showing the subject's name as a link 
              and a list of assignments sorted by due date */}
      <div className="homework-container">
        {/* line modified to take in the subjects from the useEffect to fetchSubjects and modify the useState for Subjects */}

        {subjects.map(
          (
            subject //map through each subject in the subjects array and render content for each subject
          ) => (
            <div key={subject.id} className="assignment-container">
              {/*  create a link to a page related to the subject
                      the to prop of Link component is set to /${subject.name.toLowerCase()}
                        which will navigate to a route based on the subject name in lowercase because
                        converting the subject name to lowercase, ensures that the URL will be consistent and predictable
                        The subject name is displayed as button text. */}
              <Link
                to={`/${subject.name}/${subject.id}?subjectId=${
                  subject.id
                }&teacher=${encodeURIComponent(subject.teacher)}`} // Pass teacher's name as a URL parameter
                className="rounded-button"
              >
                {subject.name}
              </Link>
              {/* create an unordered list where assignments will be displayed but first check if they exist */}
              {subject.assignments && subject.assignments.length > 0 ? (
                <ul>
                  {subject.assignments
                    .slice()
                    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
                    .slice(0, 3) //only show first 3 assignment alerts in the box
                    .map((assignment, index) => {
                      const dueDate = new Date(assignment.due_date);
                      const today = new Date();
                      const isLate =
                        dueDate < today && !isSameDay(dueDate, today);
                      return (
                        <li
                          // li can have different styles based on whether the assignment is late or not
                          // if due date is in the past, assign the li class 'late'
                          // if due date is not in the past -- keep li className as is
                          className={`assignment-message ${
                            isLate ? "late" : ""
                          }`}
                          key={`${assignment.id}_${index}`} // Key should be unique
                          onMouseEnter={() => {
                            setHoveredAssignment(assignment);
                            setShowFloatingDiv(true);
                          }}
                          onMouseLeave={() => setShowFloatingDiv(false)}
                        >
                          {createMessage([assignment])}
                        </li>
                      );
                    })}
                </ul>
              ) : (
                <div className="no-assignments-message">
                  No assignments available
                </div>
              )}
            </div>
          )
        )}
      </div>

      {/* "post it" note containing details of assignment based on where user hovers */}
      <div className="floating-div-outer-container">
        {/* Floating div */}
        {showFloatingDiv && hoveredAssignment && (
          // floating div can have different styles based on whether the assignment is late or not
          // if due date is in the past, assign the div class 'late'
          // if due date is not in the past -- keep div className as is
          <div
            className={`floating-div ${
              isLate(new Date(hoveredAssignment.due_date)) ? "late" : ""
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

export default HomeworkAlertContainer;

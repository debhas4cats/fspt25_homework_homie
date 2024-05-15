import React, { useState } from "react";
import { Link } from "react-router-dom";
import createMessage from "../utilities/createMessage"; // Import the createMessage function
import "../App.css"

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
    <div className="homework-container">
      {/* Map over subjects to render assignment containers */}
      {subjects.map((subject, index) => (
        <div key={`subject_${subject.id}_${index}`} className="assignment-container">
          {/* Render subject link */}
          <Link
            to={`/${subject.name}/${subject.id}?subjectId=${subject.id}&teacher=${encodeURIComponent(subject.teacher)}`}
            className="rounded-button"
          >
            {subject.name}
          </Link>
          {/* Render assignments list */}
          {subject.assignments && subject.assignments.length > 0 ? (
            <ul>
              {subject.assignments
                .slice()
                .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
                .slice(0, 3)
                .map((assignment, assignmentIndex) => (
                  <li
                    className={`assignment-message ${isLate(new Date(assignment.due_date)) ? "late" : ""}`}
                    key={`assignment_${subject.id}_${assignmentIndex}`} 
                    onMouseEnter={() => setHoveredAssignment(assignment)}
                    onMouseLeave={() => setHoveredAssignment(null)} // Reset hovered assignment
                  >
                    {createMessage([assignment])}
                  </li>
                ))}
            </ul>
          ) : (
            <div className="no-assignments-message">No assignments available</div>
          )}
        </div>
      ))}
      {/* Render floating div only when there's a hovered assignment */}
      {hoveredAssignment && (
        <div className={`floating-div ${isLate(new Date(hoveredAssignment.due_date)) ? "late" : ""}`}>
          <h3>{hoveredAssignment.assignment}</h3>
          <p>{hoveredAssignment.description}</p>
          <p>Teacher: {hoveredAssignment.teacher_name}</p>
          <p className="assignment-due">{new Date(hoveredAssignment.due_date).toLocaleDateString()}</p>
        </div>
      )}
    </div>
  );
}

export default HomeworkAlertContainer;
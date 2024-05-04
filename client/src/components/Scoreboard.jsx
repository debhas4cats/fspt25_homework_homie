import React from "react";
import "../App.css";

function Scoreboard({ subjects }) {
  // Function to tally assignments
  const tallyAssignments = () => {
    let lateCount = 0;
    let todayCount = 0;
    let tomorrowCount = 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    subjects.forEach((subject) => {
      if (subject.assignments) {
        subject.assignments.forEach((assignment) => {
          const dueDate = new Date(assignment.due_date);
          dueDate.setHours(0, 0, 0, 0);

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

    return { lateCount, todayCount, tomorrowCount };
  };

  // Get the counts
  const { lateCount, todayCount, tomorrowCount } = tallyAssignments();

  return (
    <div>
      <div className="assignment-scoreboard">
        <h2>Scoreboard:</h2>
        <div className="due-date">Late: {lateCount}</div>
        <div className="due-date">Due Today: {todayCount}</div>
        <div className="due-date">Due Tomorrow: {tomorrowCount}</div>
      </div>

    </div>
  );
}

export default Scoreboard;

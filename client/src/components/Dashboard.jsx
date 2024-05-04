import React, { useState, useEffect } from "react";
import "../App.css";
import Scoreboard from "./Scoreboard"; //Import the scoreboard
import HomeworkAlertContainer from "./HomeworkAlertContainer"; //Import the Homework Alert Boxes
import ClickableDate from './ClickableDate'; // Import the ClickableDate component
import PencilSVG from '../assets/pencil.svg'; // Import the pencil SVG
// Import other icons
import { BulbSVG, StarSVG, MagnifySVG, ArrowSVG } from './Icons'; // Changed the import path
import axios from "axios";

function Dashboard({ userData }) { // receiving the userdata as prop
  //refactoring the subjects state variable to take in the data from the GET subjects endpoint
  const [subjects, setSubjects] = useState([]);

 
  const fetchSubjects = async (studentId) => { // Define fetchSubjects outside of useEffect
    try {
      const response = await fetch("http://localhost:4000/homework/subjects");
      if (!response.ok) {
        throw new Error("Failed to fetch subjects");
      }
      const responseData = await response.json();
      const data = responseData.data.data; // Access data.data

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
        getHomework(subject.subjectID, studentId); // Pass studentId here
      });
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };
  
  useEffect(() => {
    if (userData) {
      // Make sure user_id exists before proceeding
      userData.user_id && fetchSubjects(userData.user_id);
    }
  }, []);

  const getHomework = async (subjectId, studentId) => {
    // use async/await to fetch data for each subject
    try {
      const { data } = await axios(
        `http://localhost:4000/homework/subjects/${subjectId}/students/${studentId}/homework`,
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

  function isLate(dueDate) {
    const today = new Date();
    return dueDate < today && !isSameDay(dueDate, today);
  }
  
  function isSameDay(date1, date2) {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }
  

  return (
    <>
    <div className="outer-container">
      <div className="corner-icons">
        {/* Bulb SVG */}
        <img src={BulbSVG} alt="Lightbulb Icon" className="bulb-icon" />
        {/* Star SVG */}
        <img src={StarSVG} alt="Star Icon" className="star-icon" />
        {/* Magnify SVG */}
        <img src={MagnifySVG} alt="Magnifying Glass Icon" className="magnify-icon" />
        {/* Arrow SVG */}
        <img src={ArrowSVG} alt="Arrow Icon" className="arrow-icon" />
      </div>
      
      <div className="date-container">
          {/* Render ClickableDate component */}
          <ClickableDate clickable={true} />
      </div>
      {/* display the tally of assignments that are late, due today, due tomorrow */}
      <Scoreboard subjects={subjects} />

      <div className="greeting-container">
        <div className="greeting">
          {/* Display SVGs */}
        <img src={PencilSVG} alt="Pencil Icon" className="pencil-icon" />
          {/* Greeting div */}
          <div className="greeting-text">
            {/* Display greeting with username */}
            What's up, {userData.username}!
          </div>
        </div>
        
      </div>

      <div className="outer-title-container">
        <div className="title-container">
          <h1 className="title">
            <span>HOMEWORK</span>
            <span>HOMIE</span>
          </h1>
        </div>
      </div>

      <HomeworkAlertContainer subjects={subjects} />

              <ul>
                {subject.assignments &&
                  subject.assignments.length > 0 &&
                  subject.assignments
                    .slice()
                    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
                    .slice(0, 3)
                    .map((assignment, index) => {
                      const dueDate = new Date(assignment.due_date);
                      const today = new Date();
                      const isLate = dueDate < today && !isSameDay(dueDate, today);
                      return (
                      <li
                        // li can have different styles based on whether the assignment is late or not
                        // if due date is in the past (is true), assigns the li class 'late'
                        // if due date is not in the past (is false) -- no additional li class will be added
                        className={`assignment-message ${isLate ? "late" : ""}`}
                        key={index}
                        onMouseEnter={() => {
                          setHoveredAssignment(assignment);
                          setShowFloatingDiv(true);
                        }}
                        onMouseLeave={() => setShowFloatingDiv(false)}>
                        {createMessage([assignment])}
                      </li>
                       );
                    })}
              </ul>
            </div>

      {/* "post it" note containing details of assignment based on where user hovers */}
      <div className="floating-div-outer-container">
        {/* Floating div */}
        {showFloatingDiv && hoveredAssignment && (
          // floating div can have different styles based on whether the assignment is late or not
          // if due date is in the past (is true), assigns the div class 'late'
          // if due date is not in the past (is false) -- no additional div class will be added
          <div className={`floating-div ${isLate(new Date(hoveredAssignment.due_date)) ? "late" : ""}`}>
            <h3>{hoveredAssignment.assignment}</h3>
            <p>{hoveredAssignment.description}</p>
            <p>Teacher: {hoveredAssignment.teacher_name}</p>
            <p className="assignment-due">
              Due: {new Date(hoveredAssignment.due_date).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
    </>
  )
}

export default Dashboard;
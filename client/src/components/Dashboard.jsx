import React, { useState, useEffect } from "react";
import "../App.css";
import Scoreboard from "./Scoreboard"; //Import the scoreboard
import HomeworkAlertContainer from "./HomeworkAlertContainer"; //Import the Homework Alert Boxes
import ClickableDate from './ClickableDate'; // Import the ClickableDate component
import axios from "axios";

function Dashboard() {

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



  return (
    <div className="outer-container">
      <div className="date-container">
          {/* Render ClickableDate component */}
          <ClickableDate clickable={true} />
      </div>
      {/* display the tally of assignments that are late, due today, due tomorrow */}
      <Scoreboard subjects={subjects} />

      <div className="outer-title-container">
        <div className="title-container">
          <h1 className="title">
            <span>HOMEWORK</span>
            <span>HOMIE</span>
          </h1>
        </div>
      </div>

      <HomeworkAlertContainer subjects={subjects} />

    
    </div>
  );
}

export default Dashboard;
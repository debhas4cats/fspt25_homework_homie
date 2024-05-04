import React, { useState, useEffect } from "react";
import "../App.css";
import Scoreboard from "./Scoreboard"; //Import the scoreboard
import HomeworkAlertContainer from "./HomeworkAlertContainer"; //Import the Homework Alert Boxes
import axios from "axios";

function Dashboard() {

  useEffect(() => {
    console.log("userData:", userData); // Log userData to check if it's being passed correctly
    if (!userData) return; // Ensure userData is available
    const fetchData = async () => {
      // use async/await to fetch data for each subject
      try {
        const promises = subjects.map(async (subject) => {
          // loop through each subject
          const response = await fetch(
            `http://localhost:4000/homework/subjects/${subject.id}/students/${userData.id}/homework`
          ); // for each subject we fetch homework data
          if (!response.ok) {
            // if the response from the server is not okay -- we throw an error to handle
            throw new Error(
              `Failed to fetch homework data for ${subject.name}`
            );
          }
          const data = await response.json(); //waits for response from the server to be fully fetched and parsed as JSON and store as variable DATA
          console.log(`Homework data for ${subject.name}${userData.id}:`, data); // console logging the data received just in case
          return { subjectId: subject.id, data: data.data }; // create an object that associates a subject's ID with its corresponding homework data.
        });
        // after fetching data from all subjects, we gather them
        //and ALL SETTLED allows us to wait for all promises to resolve or reject
        // store the results of the promises in a variable called results
        const results = await Promise.allSettled(promises);

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
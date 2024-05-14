import React, { useState } from 'react';

const SubjectComponent = () => {
  const [subject, setSubject] = useState('');
  const [assignment, setAssignment] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [priority, setPriority] = useState('');

  const handleDueDateChange = (event) => {
    const inputDate = event.target.value;
    // Here you can implement your logic to validate the due date
    // For now, let’s just update the due date without validation
    setDueDate(inputDate);
    setErrorMessage('');
  }

  const handleAssignmentChange = (event) => {
    setAssignment(event.target.value);
    setAssignment(inputDate);
    setErrorMessage('');
  }

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
    setDescription(inputDate);
    setErrorMessage('');
  }

  const handlePriorityChange = (event) => {
    setPriority(event.target.value);
    setPriority(inputDate);
    setErrorMessage('');
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch('/api/homework', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        assignment: assignment,
        description: description,
        due_date: dueDate, // Ensure the property name matches the backend
        priority: priority,
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to submit homework');
      }
      // Optionally, you can reset the form fields after successful submission
      setAssignment('');
      setDescription('');
      setDueDate('');
      setPriority('');
      setErrorMessage('');
      return response.json();
    })
    .then(data => {
      console.log(data); // Log the response from the server
    })
    .catch(error => {
      console.error('Error submitting homework:', error);
      // Handle error state or display error message to the user
    });
  }

  return (
    <div>
      <h1>Subject: {subject}</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Assignment:
          <input type="text" value={assignment} onChange={handleAssignmentChange} />
        </label>
        <label>
          Description:
          <input type="text" value={description} onChange={handleDescriptionChange}/>
        </label>
        <label>
          Due Date:
          <input type="text" value={dueDate} onChange={handleDueDateChange} />
        </label>
        <span style={{ color: 'red' }}>{errorMessage}</span>
        <label>
          Priority:
          <input type="text" value={priority} onChange={handlePriorityChange} />
        </label>
        <button type="submit">Add Homework</button>
        <button type="button" onClick={() => {
          setAssignment('');
          setDescription('');
          setDueDate('');
          setPriority('');
          setErrorMessage('');
        }}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default SubjectComponent;
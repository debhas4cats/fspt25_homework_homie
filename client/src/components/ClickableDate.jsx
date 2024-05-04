import React, { useState } from 'react';
import Calendar from 'react-calendar'; // Import Calendar component from react-calendar
import 'react-calendar/dist/Calendar.css'; // Import Calendar CSS
import "../App.css";

function ClickableDate() {
  const [initialDate] = useState(new Date()); // State to hold the initial date
  const [date, setDate] = useState(initialDate); // State to hold the selected date
  const [showCalendar, setShowCalendar] = useState(false); // State to manage calendar visibility
  const [eventInput, setEventInput] = useState(''); // State to hold the input for event creation
  const [events, setEvents] = useState(() => {
    const storedEvents = localStorage.getItem("events");
    return storedEvents ? JSON.parse(storedEvents) : {}; // Initialize with stored events or empty object
  });

  // Function to handle date change
  const handleDateChange = newDate => {
    setDate(newDate);
  };

  // Function to handle event input change
  const handleEventInputChange = event => {
    setEventInput(event.target.value);
  };

  // Function to handle event creation
  const handleEventCreate = () => {
    if (eventInput.trim() !== '') {
      const newEvents = {
        ...events,
        [date.toISOString()]: [...(events[date.toISOString()] || []), eventInput.trim()] // Use ISO string of date as key
      };
      setEvents(newEvents);
      localStorage.setItem("events", JSON.stringify(newEvents));
      setEventInput('');
    }
  };

  // Function to delete an event
  const handleEventDelete = eventIndex => {
    const eventsForDate = events[date.toISOString()];
    if (eventsForDate && Array.isArray(eventsForDate)) {
      const updatedEvents = eventsForDate.filter((_, index) => index !== eventIndex);
      const newEvents = {
        ...events,
        [date.toISOString()]: updatedEvents
      };
      setEvents(newEvents);
      localStorage.setItem("events", JSON.stringify(newEvents));
    }
  };

  // Function to close the calendar
  const handleCloseCalendar = () => {
    setShowCalendar(false);
  };

  // Function to render events for a specific date
  const renderEventsForDate = () => {
    const eventsForDate = events[date.toISOString()];
    if (Array.isArray(eventsForDate) && eventsForDate.length > 0) {
      return (
        <div>
          {eventsForDate.map((event, index) => (
            <div key={index} className="event">
              <span>{event}</span>
              <button className="event-delete" onClick={() => handleEventDelete(index)}>Delete</button>
            </div>
          ))}
        </div>
      );
    } else {
      return <div>No events for this date</div>;
    }
  };

  // Function to highlight the calendar date if there are events
  const tileContent = ({ date, view }) => {
    const eventsForDate = events[date.toISOString()];
    return eventsForDate && eventsForDate.length > 0 ? <div className="highlight-date"></div> : null;
  };

  return (
    <div className="clickable-date">
  {/* Button to toggle calendar visibility */}
  <button className="date" onClick={() => setShowCalendar(!showCalendar)}>
    {/* Display the initial date */}
    {initialDate.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}
  </button>
  {/* Render calendar if showCalendar state is true */}
  {showCalendar && (
    <div className="calendar-container">
      {/* Button to close the calendar */}
      <button className="close-calendar" onClick={handleCloseCalendar}>
        Close Calendar
      </button>
      {/* Calendar component */}
      <Calendar
        onChange={handleDateChange}
        value={date}
        tileContent={tileContent} // Highlight dates with events
      />
      {/* Input for event creation */}
      <div className="event-input-wrapper">
        <input
          type="text"
          value={eventInput}
          onChange={handleEventInputChange}
          placeholder="Enter event details..."
        />
        {/* Button to add an event */}
        <button className='add-event' onClick={handleEventCreate}>Add Event</button>
      </div>
      {/* Render events for the selected date */}
      <div className="events-for-date">
        {renderEventsForDate()}
      </div>
    </div>
  )}
</div>
  );
}

export default ClickableDate;

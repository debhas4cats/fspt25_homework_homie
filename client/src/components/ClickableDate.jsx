import React, { useState } from 'react';
import Calendar from 'react-calendar'; // Import Calendar component from react-calendar
import 'react-calendar/dist/Calendar.css'; // Import Calendar CSS
import "../App.css"; //import style

function ClickableDate() {
  const [initialDate] = useState(new Date()); // State to hold the initial date
  const [date, setDate] = useState(initialDate); // State to hold the selected date
  const [showCalendar, setShowCalendar] = useState(false); // State to manage calendar visibility
  const [eventInput, setEventInput] = useState(''); // State to hold the input for event creation
  const [events, setEvents] = useState(() => {//Events are stored in the user's browser using localStorage -- which means each user has their own set of events stored locally. 
    const storedEvents = localStorage.getItem("events"); //Events are retrieved from localStorage when the component mounts, and they're updated whenever a new event is added or deleted
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
    if (eventInput.trim() !== '') { //check if the eventInput is not empty when trimmed - if empty, nothing happens.
      const newEvents = { //if eventInput is not empty - create a new object by spreading the existing events object and adding a new entry. 
        ...events,    //new entry's key is the current date converted to an ISO string and value is an array containing
        [date.toISOString()]: [...(events[date.toISOString()] || []), eventInput.trim()] // existing events for that date with new eventInput trimmed
      };
      setEvents(newEvents); //update the state using setEvents(newEvents) to reflect the new event addition
      localStorage.setItem("events", JSON.stringify(newEvents)); //and store the updated events in localStorage
      setEventInput(''); //resets the state to empty so the input field is cleared for the next entry
    }
  };

  // Function to delete an event
  const handleEventDelete = eventIndex => { //retrieves events associated with the selected date  
    const eventsForDate = events[date.toISOString()]; //selected date is converted to an ISO string and look up date in events object
    if (eventsForDate && Array.isArray(eventsForDate)) { //check if not null and is an array - if not - there are no events to delete
      const updatedEvents = eventsForDate.filter((_, index) => index !== eventIndex); // filter out the event at the eventIndex from eventsForDate 
      const newEvents = { //create newEvents object 
        ...events, // and spread the existing events object 
        [date.toISOString()]: updatedEvents //update the events for the selected date using updatedEvents. 
      };
      setEvents(newEvents); // sets the new events state 
      localStorage.setItem("events", JSON.stringify(newEvents)); // update the local storage
    }
  };

  // Function to close the calendar
  const handleCloseCalendar = () => {
    setShowCalendar(false);
  };

  // Function to render events for a specific date
  const renderEventsForDate = () => { //retrieves events associated with the selected date  
    const eventsForDate = events[date.toISOString()]; // selected date is converted into an ISO string and used as a key to fetch events from the events object
    return eventsForDate && eventsForDate.length > 0 ? ( //checks if there are events for the selected date - verify if eventsForDate it has at least one event
      //If there are events for the selected date
       // maps through the eventsForDate array and generate each event so its wrapped in a div with a unique key attribute
        <div> 
          {eventsForDate.map((event, index) => (
            <div key={index} className="event">
              <span>{event}</span>
              <button className="event-delete" onClick={() => handleEventDelete(index)}>Delete</button>
            </div>
          ))}
        </div>
      ) : (
    <div>No events for this date</div>
      );
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
                  placeholder="Enter event..."
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

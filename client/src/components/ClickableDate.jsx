// Importing necessary dependencies
import React, { useState, useEffect, useRef, useCallback } from 'react';
import DatePicker from "react-datepicker"; // React date picker component
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, momentLocalizer, Views } from 'react-big-calendar'; // Provides a calendar component
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment'; // 'moment' library, used for parsing, validating, manipulating, and formatting dates
import { Link, useLocation } from 'react-router-dom'; // For navigation in React applications
import axios from 'axios'; // HTTP client for making requests
import "../App.css";

// Initialize momentLocalizer, which adapts 'moment' for use with 'react-big-calendar'
const localizer = momentLocalizer(moment);

// Array of objects defining the options for the calendar views (day and week)
const viewOptions = [
  { id: Views.DAY, label: "Day" },
  { id: Views.WEEK, label: "Week" },
];

function ClickableDate() {
  // State management
  const [state, setState] = useState({
    date: new Date(),
    events: [],
    newEventTitle: '',
    selected: null,
    view: Views.WEEK
  });

  // Hook to get the current location
  const location = useLocation();
  // Check if the current location is '/calendar'
  const isCalendarRoute = location.pathname === '/calendar';
  // Ref that references the date picker component
  const datepickerRef = useRef(null);

  // Effect hook to fetch events when the component mounts or when the isCalendarRoute value changes
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/api/calendar');
        // Transform fetched data to the required format and update the state
        const fetchedEvents = response.data.map(event => ({
          id: event.id,
          title: event.title,
          start: new Date(event.start),
          end: new Date(event.end),
        }));
        setState(prevState => ({ ...prevState, events: fetchedEvents }));
      } catch (error) {
        console.error('Error fetching calendar events:', error);
      }
    };
    if (isCalendarRoute) {
      fetchEvents();
    }
  }, []);

  // Handles date change
  const handleDateChange = newDate => {
    setState(prevState => ({
      ...prevState,
      date: newDate,
      newEventTitle: '',
      selected: null
    }));
  };

  // Handles selecting an event
  const handleSelectEvent = event => {
    setState(prevState => ({ ...prevState, selected: event }));
  };

  // Handles selecting a time slot
  const handleSelectSlot = slotInfo => {
    setState(prevState => ({ ...prevState, selected: slotInfo }));
  };

  // Adds a new event
  const handleAddEvent = async () => {
    const { newEventTitle, selected, events } = state;
    if (newEventTitle.trim() !== '' && selected) {
      const newEvent = {
        title: newEventTitle,
        start: selected.start,
        end: selected.end,
      };

      try {
        // POST request to add a new event
        const response = await axios.post('/api/calendar', newEvent);
        const newEventId = response.data.data[response.data.data.length - 1].id;
        const createdEvent = { ...newEvent, id: newEventId };
        setState(prevState => ({
          ...prevState,
          events: [...events, createdEvent],
          newEventTitle: '',
          selected: createdEvent
        }));
      } catch (error) {
        console.error('Error adding event:', error);
      }
    } else {
      alert('Event title cannot be empty!');
    }
  };

  // Deletes an event
  const handleDeleteEvent = async eventIdToDelete => {
    const { events } = state;
    try {
      console.log("Deleting Event with ID:", eventIdToDelete);
      if (eventIdToDelete) {
        // DELETE request to delete an event
        await axios.delete(`/api/calendar/${eventIdToDelete}`);
        setState(prevState => ({
          ...prevState,
          events: prevState.events.filter(event => event.id !== eventIdToDelete),
          selected: null
        }));
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  // Edits an event
  const handleEditEvent = useCallback(async () => {
    const { newEventTitle, selected, events } = state;
    if (newEventTitle.trim() !== '' && selected) {
      const updatedEvent = {
        ...selected,
        title: newEventTitle,
      };
  
      try {
        // PUT request to update an event
        await axios.put(`/api/calendar/${selected.id}`, updatedEvent);
        // Update the events array with the updated event
        setState(prevState => ({
          ...prevState,
          events: prevState.events.map(event => (event.id === selected.id ? updatedEvent : event)),
          newEventTitle: '',
          selected: null
        }));
      } catch (error) {
        console.error('Error editing event:', error);
      }
    } else {
      alert('Event title cannot be empty!');
    }
  }, [state]);

  // Handles view change
  const handleViewChange = newView => {
    setState(prevState => ({ ...prevState, view: newView }));
  };

  // Handles navigating to a new date
  const handleNavigate = (newDate, view, action) => {
    setState(prevState => ({ ...prevState, date: newDate }));
  };

  // Handles clicking the Today button
  const handleTodayClick = () => {
    setState(prevState => ({ ...prevState, date: new Date() }));
  };

  // Handles clicking the navigation buttons
  const onPrevNextClick = (amount, unit) => {
    setState(prevState => ({
      ...prevState,
      date: moment(state.date).add(amount, unit).toDate()
    }));
  };

  // Renders the delete button
  const renderDeleteButton = () => {
    const { selected } = state;
    return selected && <button onClick={() => handleDeleteEvent(selected.id)}>Delete</button>;
  };

  // Destructure the state object for more concise access to properties
  const { date, events, newEventTitle, selected, view } = state;

  // Generates the text to display the current date or date range based on the selected view
  const dateText = (() => {
    if (view === Views.DAY) return moment(date).format("dddd, MMMM DD");
    if (view === Views.WEEK) {
      const from = moment(date).startOf("week");
      const to = moment(date).endOf("week");
      return `${from.format("MMMM DD")} to ${to.format("MMMM DD")}`;
    }
  })();

  // Render the component
  return (
    <div className="clickable-date">
      <div>
        {/* Conditional rendering for the HOME and date buttons */}
        {isCalendarRoute ? (
          <Link to="/dashboard">
            <button className="home-rounded-button">HOME</button>
          </Link>
        ) : (
          <Link to="/calendar">
            <button className="date">
              {moment(date).format('dddd, MMMM Do YYYY')}
            </button>
          </Link>
        )}
      </div>

      <div className="outer-calendar-container">
        {isCalendarRoute && (
          <div className="calendar-container">
            <div className="toolbar">
              {/* Navigation buttons */}
              <div className='custom-date-arrow'>
                <button onClick={() => onPrevNextClick(-1, view === Views.DAY ? "d" : (view === Views.WEEK ? "w" : "M"))}>{'<'}</button>
                <button onClick={() => onPrevNextClick(1, view === Views.DAY ? "d" : (view === Views.WEEK ? "w" : "M"))}>{'>'}</button>
              </div>

              {/* Day or week buttons */}
              <div className='day-or-week-button'>
                {viewOptions.map(option => (
                  <button
                    key={option.id}
                    className={view === option.id ? 'active' : ''}
                    onClick={() => handleViewChange(option.id)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {/* Display date or date range */}
              <div className='date-text'>
                {dateText}
              </div>

              {/* Today button */}
              <button className='today' onClick={handleTodayClick}>Today</button>

              {/* Custom date picker */}
              <div className='custom-date-picker'>
                <div className="custom-text-container" onClick={() => datepickerRef.current.focus()}>
                  View Entire Month
                </div>
                <DatePicker
                  selected={date}
                  onChange={handleDateChange}
                  ref={datepickerRef}
                />
              </div>

              {/* Event input */}
              <div className='event-input-container'>
                {selected && (
                  <div className='event-input'>
                    <input
                      type="text"
                      value={newEventTitle}
                      onChange={e => setState(prevState => ({ ...prevState, newEventTitle: e.target.value }))}
                      placeholder="Enter........"
                    />
                    {selected.id ? (
                      <button onClick={handleEditEvent}>Edit & Save Event</button>
                    ) : (
                      <button onClick={handleAddEvent}>Add Event</button>
                    )}
                  </div>
                )}
              </div>

              {/* Delete button */}
              <div className='delete-button-container'>
                <div className='delete-button'>
                  {renderDeleteButton()}
                </div>
              </div>
            </div>

            {/* Calendar component */}
            <Calendar
              localizer={localizer}
              events={events}
              defaultDate={date}
              defaultView={view}
              onSelectEvent={handleSelectEvent}
              onSelectSlot={handleSelectSlot}
              selectable
              toolbar={false}
              view={view}
              date={date}
              onView={handleViewChange}
              onNavigate={handleNavigate}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ClickableDate;

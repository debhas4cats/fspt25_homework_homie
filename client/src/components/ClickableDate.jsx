import React, { useState, useEffect, useCallback, useMemo } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, momentLocalizer, Views } from 'react-big-calendar'; // Import Calendar from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import "../App.css";

const localizer = momentLocalizer(moment);

export const viewOptions = [
  { id: Views.DAY, label: "Day" },
  { id: Views.WEEK, label: "Week" },
];

function ClickableDate() {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [showEventInput, setShowEventInput] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [view, setView] = useState(Views.WEEK);
  const [showCalendar, setShowCalendar] = useState(false); // Add showCalendar state

  const location = useLocation();
  const isCalendarRoute = location.pathname === '/calendar';

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/api/calendar');
        const fetchedEvents = response.data.map(event => ({
          id: event.id,
          title: event.title,
          start: new Date(event.start), // Ensure start and end properties are proper Date objects
          end: new Date(event.end), // Ensure start and end properties are proper Date objects
        }));
        setEvents(fetchedEvents);
      } catch (error) {
        console.error('Error fetching calendar events:', error);
      }
    };

    if (isCalendarRoute) {
      fetchEvents();
    }
  }, [isCalendarRoute]);

  const handleDateChange = newDate => {
    setDate(newDate);
    setShowCalendar(false); // Hide calendar when date is changed
  };

  const handleSelectSlot = slotInfo => {
    setSelectedSlot(slotInfo);
    setShowEventInput(true);
    setNewEventTitle('');
  };

  const handleAddEvent = async () => {
    if (newEventTitle.trim() !== '' && selectedSlot) {
      const newEvent = {
        title: newEventTitle,
        start: selectedSlot.start, // Start should be directly used as Date object
        end: selectedSlot.end, // End should be directly used as Date object
      };
  
      try {
        await axios.post('/api/calendar', newEvent);
        setEvents([...events, newEvent]);
        setShowEventInput(false);
        setSelectedSlot(null);
      } catch (error) {
        console.error('Error adding event:', error);
      }
    } else {
      alert('Event title cannot be empty!');
    }
  };

  const handleDeleteEvent = async eventId => {
    try {
      await axios.delete(`/api/calendar/${eventId}`);
      const updatedEvents = events.filter(event => event.id !== eventId);
      setEvents(updatedEvents);
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };
  
  const eventComponents = events.map(event => ({
    ...event,
    id: event.id,
    title: event.title,
    start: event.start, // Ensure start and end properties are proper Date objects
    end: event.end, // Ensure start and end properties are proper Date objects
    onClick: () => handleDeleteEvent(event.id),
    buttonLabel: 'Delete',
  }));

  const handleViewChange = newView => {
    setView(newView);
  };
  const handleNavigate = (newDate, view, action) => {
    setDate(newDate);
  };

  const onPrevClick = useCallback(() => {
    if (view === Views.DAY) {
      setDate(moment(date).subtract(1, "d").toDate());
    } else if (view === Views.WEEK) {
      setDate(moment(date).subtract(1, "w").toDate());
    } else {
      setDate(moment(date).subtract(1, "M").toDate());
    }
  }, [view, date]);
  
  const onNextClick = useCallback(() => {
    if (view === Views.DAY) {
      setDate(moment(date).add(1, "d").toDate());
    } else if (view === Views.WEEK) {
      setDate(moment(date).add(1, "w").toDate());
    } else {
      setDate(moment(date).add(1, "M").toDate());
    }
  }, [view, date]);

  // Generate the date text based on the view
  const dateText = useMemo(() => {
    if (view === Views.DAY) return moment(date).format("dddd, MMMM DD");
    if (view === Views.WEEK) {
      const from = moment(date).startOf("week");
      const to = moment(date).endOf("week");
      return `${from.format("MMMM DD")} to ${to.format("MMMM DD")}`;
    }
  }, [view, date]);

  // Handle "Today" button click
  const handleTodayClick = () => {
    setDate(new Date());
  };

  return (
    <div className="clickable-date">
      <div>
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
  
      <div className='outer-calendar-container'>
        {isCalendarRoute && (
          <div className="calendar-container">
            {/* Custom toolbar */}
            <div className="toolbar">
              {/* Custom buttons for changing date */}
              <div className='custom-date-arrow'>
                <button onClick={onPrevClick}>{'<'}</button>
                <button onClick={onNextClick}>{'>'}</button>
              </div>
               
                <div className='day-or-week-button'>
                   {viewOptions.map(option => (
                    <button
                      key={option.id}
                      className={view === option.id ? 'active' : ''}
                      onClick={() => setView(option.id)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              {/* Display the date text */}
                <div className='date-text'>
                  {dateText}
                </div>
                 {/* Today button */}
                 <button className='today'onClick={handleTodayClick}>Today</button>
                <div className='custom-date-picker'>
                  {/* <span>Calendar</span> */}
                  <DatePicker
                    selected={date}
                    onChange={handleDateChange}
                      />
                </div>
            </div>

            <Calendar
              localizer={localizer}
              events={eventComponents}
              defaultDate={date}
              defaultView={view}
              onSelectSlot={handleSelectSlot}
              selectable
              toolbar={false}
              view={view}
              date={date}
              onView={handleViewChange} // Add this line
              onNavigate={handleNavigate} // Add this line
            />
          </div>
        )}
      </div>
  
      {showEventInput && (
        <div>
          <input
            type="text"
            value={newEventTitle}
            onChange={e => setNewEventTitle(e.target.value)}
            placeholder="Enter event title..."
          />
          <button onClick={handleAddEvent}>Add Event</button>
        </div>
      )}
    </div>
  );
}

export default ClickableDate;

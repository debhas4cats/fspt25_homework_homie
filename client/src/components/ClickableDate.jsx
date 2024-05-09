import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import "../App.css";

const localizer = momentLocalizer(moment);

function ClickableDate() {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [showEventInput, setShowEventInput] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null); // Store the selected slot

  const location = useLocation();
  const isCalendarRoute = location.pathname === '/calendar';

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/api/calendar');
        const fetchedEvents = response.data.map(event => ({
          id: event.id,
          title: event.title,
          start: new Date(event.start),
          end: new Date(event.end),
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
    setShowCalendar(false);
  };

  const handleSelectSlot = slotInfo => {
    setSelectedSlot(slotInfo); // Store the selected slot
    setShowEventInput(true);
    setNewEventTitle('');
  };

  const handleAddEvent = async () => {
    // Ensure title is not empty
    if (newEventTitle.trim() !== '' && selectedSlot) {
      const newEvent = {
        title: newEventTitle,
        start: new Date(selectedSlot.start),
        end: new Date(selectedSlot.end),
      };
  
      try {
        await axios.post('/api/calendar', newEvent);
        // Update events state with the new event
        setEvents([...events, newEvent]);
        // Hide the event input after adding
        setShowEventInput(false);
        // Reset selected slot
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
      // Filter out the deleted event from the events array
      const updatedEvents = events.filter(event => event.id !== eventId);
      setEvents(updatedEvents);
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };
  
  const eventComponents = events.map(event => ({
    ...event,
    endAccessor: 'end', // This is required for event rendering
    startAccessor: 'start', // This is required for event rendering
    titleAccessor: 'title', // This is required for event rendering
    id: event.id,
    title: event.title,
    start: new Date(event.start),
    end: new Date(event.end),
    desc: event.description,
    allDay: false,
    resource: event.resource,
    onClick: () => handleDeleteEvent(event.id), // Attach delete handler
    buttonLabel: 'Delete', // Button label for delete button
  }));

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

      <div className='outer-calender-container'>
        {isCalendarRoute && (
          <div className="calendar-container">
            <Calendar
              localizer={localizer}
              events={eventComponents} // Use modified event components
              defaultDate={date}
              defaultView="week"
              onSelectSlot={handleSelectSlot}
              selectable
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
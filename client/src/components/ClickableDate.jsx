import React, { useState, useEffect, useCallback, useMemo } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
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
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [view, setView] = useState(Views.WEEK);
  

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
    setNewEventTitle('');
    setSelectedEvent(null);
    setSelectedSlot(null);
  };

  const handleSelectEvent = event => {
    setSelectedEvent(event);
    setSelectedSlot(null);
  };

  const handleSelectSlot = slotInfo => {
    setSelectedSlot(slotInfo);
    setSelectedEvent(null);
  };

  const handleAddEvent = async () => {
    if (newEventTitle.trim() !== '' && selectedSlot) {
        const newEvent = {
            title: newEventTitle,
            start: selectedSlot.start,
            end: selectedSlot.end,
        };
  
        try {
            const response = await axios.post('/api/calendar', newEvent);
            // console.log("Server Response:", response.data); // Log the server response
            
            // Get the ID of the newly created event from the last element of the data array
            const newEventId = response.data.data[response.data.data.length - 1].id;
            console.log("New Event ID:", newEventId); // Log the ID of the created event
            
            // Create the event object with the received ID
            const createdEvent = {
                ...newEvent,
                id: newEventId
            };

            // Update the events array with the newly created event
            setEvents([...events, createdEvent]);
            setNewEventTitle('');
            setSelectedEvent(createdEvent); // Set the selected event immediately
            setSelectedSlot(null);
        } catch (error) {
            console.error('Error adding event:', error);
        }
    } else {
        alert('Event title cannot be empty!');
    }
};


  
  
  const handleDeleteEvent = async eventIdToDelete => {
    try {
        console.log("Deleting Event with ID:", eventIdToDelete); // Log the ID
        if (eventIdToDelete) {
            await axios.delete(`/api/calendar/${eventIdToDelete}`);
            setEvents(prevEvents => prevEvents.filter(event => event.id !== eventIdToDelete));
            setSelectedEvent(null);
            setSelectedSlot(null);
        }
    } catch (error) {
        console.error('Error deleting event:', error);
    }
  };
  

  const renderDeleteButton = () => {
    if (selectedEvent) {
      return <button onClick={() => handleDeleteEvent(selectedEvent.id)}>Delete</button>;
    } else {
      return null;
    }
  };
  
  

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

  const dateText = useMemo(() => {
    if (view === Views.DAY) return moment(date).format("dddd, MMMM DD");
    if (view === Views.WEEK) {
      const from = moment(date).startOf("week");
      const to = moment(date).endOf("week");
      return `${from.format("MMMM DD")} to ${to.format("MMMM DD")}`;
    }
  }, [view, date]);

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

      <div className='event-input-container'>
        {selectedSlot && (
          <div className='event-input'>
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
  
      <div className='delete-button-container'>
        <div className='delete-button'>
          {renderDeleteButton(selectedEvent ? selectedEvent.id : null)}
        </div>
      </div>

      <div className='outer-calendar-container'>
        {isCalendarRoute && (
          <div className="calendar-container">
            <div className="toolbar">
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
                
              <div className='date-text'>
                {dateText}
              </div>
                 
              <button className='today' onClick={handleTodayClick}>Today</button>
              <div className='custom-date-picker'>
                <DatePicker
                  selected={date}
                  onChange={handleDateChange}
                />
              </div>
            </div>

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

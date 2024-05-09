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
  const [showEventInput, setShowEventInput] = useState(false);
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
        // console.log('Fetched events:', fetchedEvents); // Log fetched events
        setEvents(fetchedEvents);
      } catch (error) {
        console.error('Error fetching calendar events:', error);
      }
    };
    // console.log('isCalendarRoute:', isCalendarRoute); // Log isCalendarRoute
    if (isCalendarRoute) {
      fetchEvents();
    }
  }, [isCalendarRoute]); // Include isCalendarRoute in the dependency array
  

  const handleDateChange = newDate => {
    setDate(newDate);
    setShowEventInput(false);
  };

  const handleSelectSlot = useCallback(
    (slotInfo, events) => {
      console.log('Slot selected:', slotInfo); // Check if handleSelectSlot is called
      console.log('Fetched events in handleSelectSlot:', events); // Log the fetched events
      const slotHasEvent = events.some(event => 
        moment(slotInfo.start).isSame(moment(event.start), 'minute') &&
        moment(slotInfo.end).isSame(moment(event.end), 'minute')
      );
      if (slotHasEvent) {
        console.log('Slot has event:', slotInfo);
        setSelectedSlot(slotInfo);
        setShowEventInput(true); // Show event input when slot has an event
        setNewEventTitle(''); // Clear input value
      } else {
        console.log('Empty slot selected');
        setSelectedSlot(slotInfo);
        setShowEventInput(true); // Show event input even for empty slot
      }
    },
    []
  );
  
  

  const handleAddEvent = async () => {
    if (newEventTitle.trim() !== '' && selectedSlot) {
      const newEvent = {
        title: newEventTitle,
        start: selectedSlot.start,
        end: selectedSlot.end,
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
      if (eventId) {
        const url = `/api/calendar/${eventId}`;
        console.log('Delete URL:', url);
        await axios.delete(url);
        const updatedEvents = events.filter(event => event.id !== eventId);
        setEvents(updatedEvents);
        console.log('Event deleted successfully');
      } else {
        console.error('Event ID is undefined');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };


  const eventComponents = events.map(event => ({
    ...event,
    id: event.id,
    title: event.title,
    start: event.start,
    end: event.end,
    onClick: () => handleDeleteEvent(event.id),
    buttonLabel: 'Delete',
  }));

  const renderDeleteButton = () => {
    if (selectedSlot && selectedSlot.id) {
      console.log('Delete button is rendering');
      return (
        <button onClick={() => {
          console.log('Delete button clicked');
          handleDeleteEvent(selectedSlot.id);
        }}>Delete</button>
      );
    } else if (showEventInput) {
      return null; // Hide delete button when adding new event
    } else {
      return null; // Hide delete button otherwise
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
        {showEventInput && (
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
        {renderDeleteButton()}
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
                 
              <button className='today'onClick={handleTodayClick}>Today</button>
              <div className='custom-date-picker'>
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
              onSelectSlot={slotInfo => handleSelectSlot(slotInfo, events)}
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
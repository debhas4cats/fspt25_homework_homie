const express = require('express');
const router = express.Router();
const db = require("../model/helper");

// Express middleware to parse JSON request bodies
router.use(express.json());


//Define a function to retrieve events from the database
const fetchEvents = async (res) => {
    try {
        // Fetch events from the database
        const events = await db("SELECT * FROM calendar");

        // Check if events were retrieved successfully
        if (!events || events.length === 0) {
            // If no events found, return a 404 status code
            return res.status(404).json({ message: "No events found." });
        }

        // Return fetched events as JSON response
        res.status(200).json(events);
        // console.log("events:", events)
    } catch (err) {
        // Handle any errors
        console.error("Error fetching events:", err);
        res.status(500).json({ message: "Error fetching events." });
    }
};


// Get all calendar events
router.get('/', async (req, res) => {
    try {
        const results = await db("SELECT * FROM calendar");
        if (results.error) {
            // If there's an error in the query, return a 500 status code
            return res.status(500).json({ message: results.error });
        }
        if (results.data.length === 0) {
            // If no events found, return a 404 status code
            return res.status(404).json({ message: "No events found." });
        }
        // Return fetched events as JSON response
        res.status(200).json(results.data);
    } catch (err) {
        // Handle any other errors
        res.status(500).json({ message: err.message });
    }
});


// Add a new calendar event
// Add a new calendar event
router.post('/', async (req, res) => {
    const { title, start, end } = req.body;
    if (!title || !start || !end) {
        return res.status(400).json({ message: "Title, start, and end are required." });
    }

    try {
        // Adjust time zone offset
        const offset = new Date().getTimezoneOffset() * 60000; // Offset in milliseconds
        const adjustedStart = new Date(new Date(start) - offset);
        const adjustedEnd = new Date(new Date(end) - offset);

        // Format the start and end dates
        const formattedStart = adjustedStart.toISOString().slice(0, 19).replace('T', ' ');
        const formattedEnd = adjustedEnd.toISOString().slice(0, 19).replace('T', ' ');

        // Insert the new event into the database
        await db(`INSERT INTO calendar (title, start, end) VALUES (?, ?, ?)`, [title, formattedStart, formattedEnd ]);
        
        // Fetch events from the database using the helper function
        await fetchEvents(res);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



router.put('/:id', async (req, res) => {
    const eventId = req.params.id;
    const { title, start, end } = req.body;

    // Check if at least one field is provided for updating
    if (!title && !start && !end) {
        return res.status(400).json({ message: "At least one field (title, start, end) is required for updating." });
    }

    try {
        let updateQuery = "UPDATE calendar SET";
        let updateValues = [];

        // Dynamically build the update query and values
        if (title) {
            updateQuery += " title = ?,";
            updateValues.push(title);
        }
        if (start) {
            // Format the start datetime to 'YYYY-MM-DD HH:MM:SS'
            const formattedStart = new Date(start).toISOString().slice(0, 19).replace('T', ' ');
            updateQuery += " start = ?,";
            updateValues.push(formattedStart);
        }
        if (end) {
            // Format the end datetime to 'YYYY-MM-DD HH:MM:SS'
            const formattedEnd = new Date(end).toISOString().slice(0, 19).replace('T', ' ');
            updateQuery += " end = ?,";
            updateValues.push(formattedEnd);
        }

        // Remove the trailing comma from the query string
        updateQuery = updateQuery.slice(0, -1);
        
        // Add the WHERE clause for the specific event
        updateQuery += " WHERE id = ?";
        updateValues.push(eventId);

        // Execute the update query
        await db(updateQuery, updateValues);

        // Fetch events from the database using the helper function
        await fetchEvents(res);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



// Delete a calendar event
router.delete('/:id', async (req, res) => {
    const eventId = req.params.id;

    try {
        // Delete the event from the database using parameterized query
        const result = await db('DELETE FROM calendar WHERE id = ?', [eventId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Event not found." });
        }
        
        // Fetch events from the database using the helper function
        await fetchEvents(res);
    } catch (err) {
        console.error('Error deleting event:', err); // Log the error
        res.status(500).json({ message: err.message });
    }
});



module.exports = router;

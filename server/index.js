import express from 'express';
import pg from 'pg';
import cors from 'cors';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';

const app = express();
const port = 5000;

//Databse connection
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "epravand",
    password: "admin",
    port: 5432
});
db.connect();

// Auth Middleware
const auth = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).send('Access Denied');
    }

    try {
        const verified = jwt.verify(token, 'jwt_secret');
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).send('Invalid Token');
    }
};
// Set up Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
  
const upload = multer({ storage });
//Using middleware
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(cookieParser());
app.use(session({
    secret: 'secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

//-------------------------------------------------------------------Route Handling-----------------------------------------------------------

//Home Route
app.get("/", (req, res) => {
    res.send("Welcome to EPraVand");
});

//Route to fetch upcomming events details for landing/main/home page
app.get("/events", (req, res) => {
    const currentDate = new Date().toISOString(); // Get the current date in ISO format

    db.query("SELECT * FROM event WHERE is_approved = true AND start_date > $1", [currentDate], (err, result) => {
        if (err) {
            console.error("Error fetching events:", err);
            res.status(500).json({ error: "Internal server error" });
        } else {
            res.json({ data: result.rows });
        }
    });
});

//Route to fetch past events details for landing page
app.get("/past-events", (req, res) => {
    const currentDate = new Date().toISOString(); // Get the current date in ISO format

    db.query("SELECT * FROM event WHERE is_approved = true AND start_date <= $1", [currentDate], (err, result) => {
        if (err) {
            console.error("Error fetching past events:", err);
            res.status(500).json({ error: "Internal server error" });
        } else {
            res.json({ data: result.rows });
        }
    });
});


// Route to fetch specific event details by event ID: To display in the detailed event view section of landing page when clicked on Event
app.get('/events/:eventId', async (req, res) => {
    const { eventId } = req.params;

    try {
        const eventQuery = `
            SELECT e.event_id, e.title, e.description, e.start_date, e.end_date, e.venue, e.participant_strength, e.file_path, et.type_name AS category, 
                   u.name AS coordinator_name, u.email AS email,
                   (SELECT array_agg(se.title) FROM sub_event se WHERE se.event_id = e.event_id) AS sub_events_titles,
                   (SELECT json_agg(json_build_object('name', u.name, 'email', u.email, 'title', se.title))
                    FROM sub_event se 
                    JOIN coordinator_detail cd ON se.coordinator_id = cd.coordinator_id 
                    JOIN user_account u ON cd.user_id = u.user_id 
                    WHERE se.event_id = e.event_id) AS sub_events_coordinators
            FROM event e
            JOIN coordinator_detail cd ON e.coordinator_id = cd.coordinator_id
            JOIN user_account u ON cd.user_id = u.user_id
            JOIN event_type et ON e.type_id = et.event_type_id
            WHERE e.event_id = $1
        `;
        const eventResult = await db.query(eventQuery, [eventId]);
        if (eventResult.rows.length === 0) {
            return res.status(404).send('Event not found');
        }
        const eventDetails = eventResult.rows[0];
        res.json(eventDetails);
    } catch (error) {
        console.error('Error fetching event details:', error);
        res.status(500).send('Error fetching event details');
    }
});

//route to fetch cousre/department and institution details to display in dropdown for participant registration
app.get('/registration-details/:eventId', async (req, res) => {
    const { eventId } = req.params;

    if (!eventId) {
        return res.status(400).send('Event ID is required for fetching sub-events');
    }

    try {
        const institutionsQuery = 'SELECT institution_id, institution_name FROM institution';
        const subEventsQuery = 'SELECT sub_event_id, title FROM sub_event WHERE event_id = $1';
        const coursesQuery = 'SELECT course_id, course_name FROM course';
        const departmentsQuery = 'SELECT department_id, department_name FROM department';

        const [institutionsResult, subEventsResult, coursesResult, departmentsResult] = await Promise.all([
            db.query(institutionsQuery),
            db.query(subEventsQuery, [eventId]),
            db.query(coursesQuery),
            db.query(departmentsQuery)
        ]);

        res.json({
            institutions: institutionsResult.rows,
            subEvents: subEventsResult.rows,
            courses: coursesResult.rows,
            departments: departmentsResult.rows
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    }
});

// Route to insert/register participant 
app.post('/participant-registration', async (req, res) => {
    const { eventId, participantDetails, selectedSubEvents } = req.body; // Change selectedSubEvent to selectedSubEvents

    // Determine participant type based on institution ID
    const participantTypeId = participantDetails.institution === 1 ? 1 : 2;

    try {
        // Begin transaction
        await db.query('BEGIN');

        // Insert participant into participant table
        const participantInsertQuery = `
            INSERT INTO participant (participant_type_id, course_id, name, reg_no, gender, dob, email, phone, institution_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING participant_id
        `;
        const participantValues = [
            participantTypeId,
            participantDetails.course_id,
            participantDetails.fullName,
            participantDetails.rollNumber,
            participantDetails.gender, // Expecting a single character
            participantDetails.dob,
            participantDetails.email,
            participantDetails.contactNumber,
            participantDetails.institution
        ];
        const participantResult = await db.query(participantInsertQuery, participantValues);
        const participantId = participantResult.rows[0].participant_id;

        // Insert into event_participant table
        const eventParticipantInsertQuery = `
            INSERT INTO event_participant (event_id, participant_id)
            VALUES ($1, $2) RETURNING event_participant_id
        `;
        const eventParticipantResult = await db.query(eventParticipantInsertQuery, [eventId, participantId]);
        const eventParticipantId = eventParticipantResult.rows[0].event_participant_id;
        console.log(eventParticipantId);

        // Insert into sub_event_participant table if selectedSubEvents is not empty
        if (selectedSubEvents && selectedSubEvents.length > 0) {
            const subEventParticipantInsertQuery = `
                INSERT INTO sub_event_participant (event_participant_id, sub_event_id)
                VALUES ($1, $2)
            `;

            // Insert each selected sub-event
            for (const subEventId of selectedSubEvents) {
                await db.query(subEventParticipantInsertQuery, [eventParticipantId, subEventId]);
            }
        }

        // Commit transaction
        await db.query('COMMIT');

        res.status(201).json({ message: 'Participant inserted successfully' });
    } catch (error) {
        await db.query('ROLLBACK');
        console.error('Error inserting participant:', error);
        res.status(500).json({ message: 'Error inserting participant' });
    }
});


//route to insert/register volunteer 
app.post('/volunteer-registration', async (req, res) => {
    const { eventId, volunteerDetails} = req.body;

    try {
        // Begin transaction
        await db.query('BEGIN');

        // Insert participant into participant table
        const volunteerInsertQuery = `INSERT INTO volunteer(event_id, course_id, name, reg_no, email, phone)VALUES ($1, $2, $3, $4, $5, $6)`;
        const volunteerValues = [
            eventId,
            volunteerDetails.course_id,
            volunteerDetails.fullName,
            volunteerDetails.rollNumber,
            volunteerDetails.email,
            volunteerDetails.contactNumber
        ];
        await db.query(volunteerInsertQuery, volunteerValues);
      

        // Commit transaction
        await db.query('COMMIT');

        res.status(201).json({ message: 'Volunteer inserted successfully' });
    } catch (error) {
        await db.query('ROLLBACK');
        console.error('Error inserting volunteer:', error);
        res.status(500).json({ message: 'Error inserting volunteer' });
    }
});

//------------------------------------------------------User Login-------------------------------------------------------------------

// Route to handle login for different user roles
app.post('/login', async (req, res) => {
    const { username, password, role_id } = req.body;

    const query = `
        SELECT user_account.*, role.role_id, role.role_name, coordinator_detail.is_approved 
        FROM user_account 
        JOIN user_role ON user_account.user_id = user_role.user_id 
        JOIN role ON user_role.role_id = role.role_id 
        LEFT JOIN coordinator_detail ON user_account.user_id = coordinator_detail.user_id 
        WHERE user_account.username = $1`;

    try {
        const result = await db.query(query, [username]);

        if (result.rows.length === 0) {
            return res.status(400).send('User not found');
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).send('Invalid credentials');
        }

        // Check if the retrieved role matches the provided role_id
        if (user.role_id !== parseInt(role_id, 10)) {
            return res.status(403).send('Unauthorized role');
        }

        // If the user is a coordinator, check the approval status
        if (user.role_id === 3 && !user.is_approved) {
            return res.status(403).send('Coordinator not approved');
        }

        const token = jwt.sign({ id: user.user_id }, 'jwt_secret', { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true }).send('Logged in');
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send('Error logging in');
    }
});

//route to access the user
app.get('/user', auth, async (req, res) => {
    const userId = req.user.id;

    try {
        const query = 'SELECT name FROM user_account WHERE user_id = $1';
        const result = await db.query(query, [userId]);

        if (result.rows.length === 0) {
            return res.status(404).send('User not found');
        }

        const userName = result.rows[0].name;
        res.json({ name: userName });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).send('Error fetching user data');
    }
});

//-----------------------------------------------------------Coordinator-----------------------------------------------------------

//Route to register a event coordinator
app.post('/register', async (req, res) => {
    const { name, email, phone, username, password } = req.body;
    if (!name || !email || !phone || !username || !password) {
        return res.status(400).send('All fields are required');
    }

    try {
        const emailCheckQuery = 'SELECT * FROM user_account WHERE email = $1';
        const emailCheckResult = await db.query(emailCheckQuery, [email]);

        if (emailCheckResult.rows.length > 0) {
            return res.status(400).send('Email already exists');
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);

        await db.query('BEGIN');

        const userInsertQuery = 'INSERT INTO user_account (name, email, phone, username, password) VALUES ($1, $2, $3, $4, $5) RETURNING user_id';
        const roleInsertQuery = 'INSERT INTO user_role (user_id, role_id) VALUES ($1, (SELECT role_id FROM role WHERE role_name = $2))';
        const coordinatorInsertQuery = 'INSERT INTO coordinator_detail (user_id) VALUES ($1)';

        const userResult = await db.query(userInsertQuery, [name, email, phone, username, hashedPassword]);
        const userId = userResult.rows[0].user_id;

        await db.query(roleInsertQuery, [userId, 'event coordinator']);
        await db.query(coordinatorInsertQuery, [userId]);

        await db.query('COMMIT');
        res.status(201).send('User Registered');
    } catch (error) {
        await db.query('ROLLBACK');
        console.error('Error registering user:', error);
        res.status(500).send('Error registering user');
    }
});


// Route to fetch events coordinated by the logged-in coordinator
app.get('/coordinator-events', auth, async (req, res) => {
    const userId = req.user.id;

    try {
        const query = `
            SELECT e.event_id, e.title, e.description, e.start_date, e.end_date, e.venue, e.participant_strength, e.file_path, et.type_name AS category, e.is_approved
            FROM event e
            JOIN coordinator_detail cd ON e.coordinator_id = cd.coordinator_id
            JOIN user_account u ON cd.user_id = u.user_id
            JOIN event_type et ON e.type_id = et.event_type_id
            WHERE u.user_id = $1
        `;
        const result = await db.query(query, [userId]);

        // if (result.rows.length === 0) {
        //     return res.status(404).send('No events found for this coordinator');
        // }

        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching coordinator events:', error);
        res.status(500).send('Error fetching coordinator events');
    }
});

//Route to fetch event types to display in add new event form for coordinator
app.get('/event-types', auth, async (req, res) => {
    try {
        const result = await db.query('SELECT event_type_id, type_name FROM event_type');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching event types:', error);
        res.status(500).send('Error fetching event types');
    }
});

//route to fetch list of approved coordinators to display in add new event form for coordinator
app.get('/coordinators', auth, async (req, res) => {
    try {
        const result = await db.query(`
            SELECT u.user_id, u.name 
            FROM user_account u 
            JOIN coordinator_detail c ON u.user_id = c.user_id
        `);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching coordinators:', error);
        res.status(500).send('Error fetching coordinators');
    }
});


// Route to insert new event details with file upload by coordinator
app.post('/add-event', auth, upload.array('files'), async (req, res) => {
    const { title, description, startDate, startTime, endDate, endTime, venue, participantStrength, type, subEvents } = JSON.parse(req.body.eventData);
    const userId = req.user.id;

    try {
        // Fetch the coordinator_id for the logged-in user
        const coordinatorQuery = 'SELECT coordinator_id FROM coordinator_detail WHERE user_id = $1';
        const coordinatorResult = await db.query(coordinatorQuery, [userId]);
        if (coordinatorResult.rows.length === 0) {
            return res.status(400).send('Coordinator not found');
        }
        const coordinatorId = coordinatorResult.rows[0].coordinator_id;

        // Determine the type_id based on the event type name
        const typeQuery = 'SELECT event_type_id FROM event_type WHERE type_name = $1';
        const typeResult = await db.query(typeQuery, [type]);
        if (typeResult.rows.length === 0) {
            return res.status(400).send('Invalid event type');
        }
        const typeId = typeResult.rows[0].event_type_id;

        // Gather file paths from the uploaded files
        const filePaths = req.files.map(file => file.path);

        // Start transaction
        await db.query('BEGIN');

        // Insert event into the event table
        const eventInsertQuery = `
            INSERT INTO event (coordinator_id, type_id, title, description, start_date, end_date, venue, participant_strength, file_path)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING event_id
        `;
        const eventResult = await db.query(eventInsertQuery, [coordinatorId, typeId, title, description, `${startDate} ${startTime}`, `${endDate} ${endTime}`, venue, participantStrength, filePaths]);
        const eventId = eventResult.rows[0].event_id;

        // Insert sub-events if any
        if (subEvents && subEvents.length > 0) {
            const subEventInsertQuery = `
                INSERT INTO sub_event (event_id, coordinator_id, title)
                VALUES ($1, $2, $3)
            `;
            for (const subEvent of subEvents) {
                const { coordinator, title } = subEvent;

                // Fetch the coordinator_id for the sub-event's coordinator
                const subEventCoordinatorResult = await db.query(coordinatorQuery, [coordinator]);
                if (subEventCoordinatorResult.rows.length === 0) {
                    await db.query('ROLLBACK');
                    return res.status(400).send('Sub-event coordinator not found');
                }
                const subEventCoordinatorId = subEventCoordinatorResult.rows[0].coordinator_id;

                await db.query(subEventInsertQuery, [eventId, subEventCoordinatorId, title]);
            }
        }

        // Commit transaction
        await db.query('COMMIT');
        res.status(201).send('Event and sub-events inserted successfully');
    } catch (error) {
        await db.query('ROLLBACK');
        console.error('Error inserting event and sub-events:', error);
        res.status(500).send('Error inserting event and sub-events');
    }
});


//route to fetch appointed sub events details of logged in coordinator
app.get('/appointed-sub-events', auth, async (req, res) => {
    const userId = req.user.id; 
    try {
        const query = `
            SELECT se.sub_event_id, se.title, e.start_date, e.end_date,
                   e.title AS main_event_title, u.name AS coordinator_name
            FROM sub_event se
            JOIN event e ON se.event_id = e.event_id
            JOIN coordinator_detail cd ON se.coordinator_id = cd.coordinator_id
            JOIN user_account u ON cd.user_id = u.user_id
            WHERE se.coordinator_id = (
                SELECT coordinator_id 
                FROM coordinator_detail 
                WHERE user_id = $1
            )
            AND (se.description IS NULL);
        `;
        const result = await db.query(query, [userId]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching appointed sub-events:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to update/insert sub-event details without file upload by the appointed sub event coordinator
app.post('/sub-events/:sub_event_id/details', auth, async (req, res) => {
    const subEventId = req.params.sub_event_id;
    const {
        description,
        end_date,
        end_time,
        participant_strength,
        start_date,
        start_time,
        type,
        venue
    } = req.body; // Destructuring directly from req.body

    try {
        // Determine the type_id based on the event type name
        const typeQuery = 'SELECT event_type_id FROM event_type WHERE type_name = $1';
        const typeResult = await db.query(typeQuery, [type]);
        
        if (typeResult.rows.length === 0) {
            return res.status(400).send('Invalid event type');
        }

        const typeId = typeResult.rows[0].event_type_id;

        // Begin transaction
        await db.query('BEGIN');

        // Update sub-event in the sub_event table
        const updateSubEventQuery = `
            UPDATE sub_event
            SET description = $1,
                venue = $2,
                participant_strength = $3,
                type_id = $4,
                start_date = $5,
                end_date = $6
            WHERE sub_event_id = $7
        `;

        const startDateTime = `${start_date} ${start_time}`;
        const endDateTime = `${end_date} ${end_time}`;

        await db.query(updateSubEventQuery, [
            description,
            venue,
            participant_strength,
            typeId,
            startDateTime,
            endDateTime,
            subEventId,
        ]);

        // Commit transaction
        await db.query('COMMIT');
        res.status(200).json({ message: 'Sub-event details updated successfully' });
    } catch (error) {
        // Rollback transaction in case of error
        await db.query('ROLLBACK');
        console.error('Error updating sub-event details:', error);
        res.status(500).json({ message: 'Error updating sub-event details' });
    }
});

// Route to fetch participant details along with event, sub-events, course name, and institution name for participants whose is_approved is NULL
app.get('/new-participants', async (req, res) => {
    try {
        const query = `
            SELECT
                p.participant_id AS id,
                p.name AS fullName,
                p.reg_no AS registerNumber,
                p.gender,
                p.dob,
                p.email,
                p.phone AS contactNumber,
                p.institution_id,
                c.course_name AS course,
                d.department_name AS department,
                ARRAY_AGG(DISTINCT e.title) AS events,
                ARRAY_AGG(DISTINCT se.title) AS subEvents,
                i.institution_name AS institutionName
            FROM participant p
            JOIN course c ON p.course_id = c.course_id
            JOIN department d ON c.department_id = d.department_id
            LEFT JOIN event_participant ep ON p.participant_id = ep.participant_id
            LEFT JOIN event e ON ep.event_id = e.event_id
            LEFT JOIN sub_event_participant sep ON ep.event_participant_id = sep.event_participant_id
            LEFT JOIN sub_event se ON sep.sub_event_id = se.sub_event_id
            LEFT JOIN institution i ON p.institution_id::int = i.institution_id
            WHERE p.is_approved IS NULL
            GROUP BY p.participant_id, c.course_name, d.department_name, i.institution_name
        `;

        const result = await db.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching participant details:', error);
        res.status(500).json({ message: 'Error fetching participant details' });
    }
});

// Route to approve a participant
app.post('/approve-participant/:id', async (req, res) => {
    const participantId = req.params.id;

    try {
        const query = `
            UPDATE participant
            SET is_approved = true
            WHERE participant_id = $1
        `;
        await db.query(query, [participantId]);

        res.status(200).json({ message: `Participant with ID ${participantId} approved successfully` });
    } catch (error) {
        console.error('Error approving participant:', error);
        res.status(500).json({ message: 'Error approving participant' });
    }
});

// Route to reject a participant
app.post('/reject-participant/:id', async (req, res) => {
    const participantId = req.params.id;

    try {
        const query = `
            UPDATE participant
            SET is_approved = false
            WHERE participant_id = $1
        `;
        await db.query(query, [participantId]);

        res.status(200).json({ message: `Participant with ID ${participantId} rejected successfully` });
    } catch (error) {
        console.error('Error rejecting participant:', error);
        res.status(500).json({ message: 'Error rejecting participant' });
    }
});


//-----------------------------------------------------------superadmin-------------------------------------------------------------------

//Route to Fetch coordinators for approval/rejection by superadmin
app.get('/coordinators', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT user_account.user_id, user_account.name, user_account.email, user_account.phone, user_account.username, coordinator_detail.is_approved, coordinator_detail.is_disabled 
            FROM user_account 
            JOIN user_role ON user_account.user_id = user_role.user_id 
            JOIN coordinator_detail ON user_account.user_id = coordinator_detail.user_id 
            WHERE user_role.role_id = 3
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching coordinators:', error);
        res.status(500).send('Error fetching coordinators');
    }
});

//Route to Approve coordinator
app.post('/coordinators/:id/approve', auth, async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('UPDATE coordinator_detail SET is_approved = TRUE WHERE user_id = $1 AND is_approved = FALSE', [id]);
        res.send('Coordinator approved');
    } catch (error) {
        console.error('Error approving coordinator:', error);
        res.status(500).send('Error approving coordinator');
    }
});

//Route to Reject coordinator
app.post('/coordinators/:id/reject', auth, async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM user_role WHERE user_id = $1 AND role_id = 3', [id]);
        await db.query('DELETE FROM coordinator_detail WHERE user_id = $1', [id]);
        res.send('Coordinator rejected');
    } catch (error) {
        console.error('Error rejecting coordinator:', error);
        res.status(500).send('Error rejecting coordinator');
    }
});

//Route to Disable coordinator
app.post('/coordinators/:id/disable', auth, async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('UPDATE coordinator_detail SET is_disabled = TRUE WHERE user_id = $1', [id]);
        res.send('Coordinator disabled');
    } catch (error) {
        console.error('Error disabling coordinator:', error);
        res.status(500).send('Error disabling coordinator');
    }
});

//Route to Enable coordinator
app.post('/coordinators/:id/enable', auth, async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('UPDATE coordinator_detail SET is_disabled = FALSE WHERE user_id = $1', [id]);
        res.send('Coordinator enabled');
    } catch (error) {
        console.error('Error enabling coordinator:', error);
        res.status(500).send('Error enabling coordinator');
    }
});

// Route to insert new admin profile
app.post('/add-admin-profile', auth, async (req, res) => {
    const { name, email, phone, username, password } = req.body;

    try {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Fetch role_id for 'admin' role
        const roleQuery = `
            SELECT role_id FROM role WHERE role_name = 'admin'
        `;
        const roleResult = await db.query(roleQuery);
        const roleId = roleResult.rows[0].role_id;

        // Insert into user_account table
        const userInsertQuery = `
            INSERT INTO user_account (name, email, phone, username, password)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING user_id
        `;
        const userValues = [name, email, phone, username, hashedPassword];
        const userResult = await db.query(userInsertQuery, userValues);
        const userId = userResult.rows[0].user_id;

        // Insert into user_role table with fetched role_id
        const userRoleInsertQuery = `
            INSERT INTO user_role (user_id, role_id)
            VALUES ($1, $2)
        `;
        const userRoleValues = [userId, roleId];
        await db.query(userRoleInsertQuery, userRoleValues);

        res.status(201).json({ message: 'Admin profile created successfully' });
    } catch (error) {
        console.error('Error inserting admin profile:', error);
        res.status(500).json({ message: 'Error inserting admin profile' });
    }
});


//--------------------------------------------------------------------ADMIN---------------------------------------------------------------


// Route to fetch all events 
app.get('/admin-events', auth, async (req, res) => {
    try {
        const query = `
            SELECT e.event_id, e.title, e.description, e.start_date, e.end_date, e.venue, e.participant_strength, e.file_path, et.type_name AS category, e.is_approved
            FROM event e
            JOIN event_type et ON e.type_id = et.event_type_id
            ORDER BY e.start_date DESC;
        `;
        const result = await db.query(query);

        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching admin events:', error);
        res.status(500).send('Error fetching admin events');
    }
});


// Route to fetch event details along with coordinator names and sub-events titles and associated coordinators names for approval
app.get("/events-for-approval", async (req, res) => {
    try {
      const eventsQuery = `
        SELECT e.event_id, e.title, e.start_date, e.end_date, e.venue, e.is_approved, e.file_path,
               u.name AS coordinator_name,
               (SELECT array_agg(se.title) FROM sub_event se WHERE se.event_id = e.event_id) AS sub_events_titles,
               (SELECT array_agg(u.name) FROM sub_event se JOIN coordinator_detail cd ON se.coordinator_id = cd.coordinator_id JOIN user_account u ON cd.user_id = u.user_id WHERE se.event_id = e.event_id) AS sub_events_coordinators
        FROM event e
        JOIN coordinator_detail cd ON e.coordinator_id = cd.coordinator_id
        JOIN user_account u ON cd.user_id = u.user_id
        WHERE e.is_approved IS NULL -- Filter events with null approval
      `;
      const eventsResult = await db.query(eventsQuery);
      const events = eventsResult.rows;
      res.json(events);
    } catch (error) {
      console.error('Error fetching events for approval:', error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  



// Route to approve an event
app.put('/approve-event/:eventId', auth, async (req, res) => {
    const { eventId } = req.params;

    try {
        await db.query('UPDATE event SET is_approved = true WHERE event_id = $1', [eventId]);
        res.status(200).send('Event approved successfully');
    } catch (error) {
        console.error('Error approving event:', error);
        res.status(500).send('Error approving event');
    }
});

// Route to reject an event
app.put('/reject-event/:eventId', auth, async (req, res) => {
    const { eventId } = req.params;

    try {
        await db.query('UPDATE event SET is_approved = false WHERE event_id = $1', [eventId]);
        res.status(200).send('Event rejected successfully');
    } catch (error) {
        console.error('Error rejecting event:', error);
        res.status(500).send('Error rejecting event');
    }
});


//route to handle logout of user
app.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            res.status(500).send('Logout failed');
        } else {
            res.clearCookie('token').send('Logged out');
        }
    });
});

// Route to handle change password of all user
app.post('/change-password', auth, async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;
    try {
        const userQuery = 'SELECT * FROM user_account WHERE user_id = $1';
        const userResult = await db.query(userQuery, [userId]);
        if (userResult.rows.length === 0) {
            return res.status(404).send('User not found');
        }

        const user = userResult.rows[0];
        const isMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isMatch) {
            return res.status(400).send('Old password is incorrect');
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        const updateQuery = 'UPDATE user_account SET password = $1 WHERE user_id = $2';
        await db.query(updateQuery, [hashedNewPassword, userId]);

        res.send('Password changed successfully');
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).send('Error changing password');
    }
});

//route to hanle page not found error
app.get("*", (req, res) => {
    res.status(404).send("Error 404!");
});

//starting the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

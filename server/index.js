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

//----------------------------------Route Handling---------------------------------------------
app.get("/", (req, res) => {
    res.send("Welcome to EPraVand");
});

//Route to fetch events for landing page
app.get("/events", (req, res) => {
    db.query("SELECT * FROM event", (err, result) => {
        if (err) {
            console.error("Error fetching events:", err);
            res.status(500).json({ error: "Internal server error" });
        } else {
            res.json({ data: result.rows });
        }
    });
});

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
//-----------------------------------------------------------coordinator-----------------------------------------------------------


app.get('/event-types', auth, async (req, res) => {
    try {
        const result = await db.query('SELECT event_type_id, type_name FROM event_type');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching event types:', error);
        res.status(500).send('Error fetching event types');
    }
});

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


// Route to insert event details with file upload
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


// Route to handle change password
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
//----------------------------------------------superadmin-------------------------------------------------------

// Fetch coordinators for approval/rejection
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

// Approve coordinator
app.post('/coordinators/:id/approve', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('UPDATE coordinator_detail SET is_approved = TRUE WHERE user_id = $1 AND is_approved = FALSE', [id]);
        res.send('Coordinator approved');
    } catch (error) {
        console.error('Error approving coordinator:', error);
        res.status(500).send('Error approving coordinator');
    }
});

// Reject coordinator
app.post('/coordinators/:id/reject', async (req, res) => {
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

// Disable coordinator
app.post('/coordinators/:id/disable', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('UPDATE coordinator_detail SET is_disabled = TRUE WHERE user_id = $1', [id]);
        res.send('Coordinator disabled');
    } catch (error) {
        console.error('Error disabling coordinator:', error);
        res.status(500).send('Error disabling coordinator');
    }
});

// Enable coordinator
app.post('/coordinators/:id/enable', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('UPDATE coordinator_detail SET is_disabled = FALSE WHERE user_id = $1', [id]);
        res.send('Coordinator enabled');
    } catch (error) {
        console.error('Error enabling coordinator:', error);
        res.status(500).send('Error enabling coordinator');
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

//route to hanle page not found error
app.get("*", (req, res) => {
    res.status(404).send("Error 404!");
});

//starting the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

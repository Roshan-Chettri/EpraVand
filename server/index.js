import express from 'express';
import pg from 'pg';
import cors from 'cors';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import jwt from 'jsonwebtoken';

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
        const verified = jwt.verify(token, 'your_jwt_secret');
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).send('Invalid Token');
    }
};

//Using middleware
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(cookieParser());
app.use(session({
    secret: 'your_secret_key',
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
            console.log(result.rows);
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

//Route to handle login of event coordinator
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM user_account WHERE username = $1';
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

        const token = jwt.sign({ id: user.user_id }, 'your_jwt_secret', { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true }).send('Logged in');
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send('Error logging in');
    }
});

//route to handle access to dashboard
app.get('/dashboard', auth, (req, res) => {
    res.send('This is the dashboard');
});


//route to access the user
app.get('/user', auth, (req, res) => {
    res.json(req.user);
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

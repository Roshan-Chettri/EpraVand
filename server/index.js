import express from "express";
import pg from "pg";
import cors from "cors";



const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "epravand",
    password: "admin",
    port: 5432
});

db.connect();
 
const app = express();
const port = 5000;

app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Use CORS middleware
app.use(cors());


app.get("/", (req, res) => {
    res.send("Welcome to EPraVand");
});

// Fetch events from the database and send them as JSON
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

// Handle 404 errors
app.get("*", (req, res) => {
    res.status(404).send("Error 404!");
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
// Import express from nodejs 
const express = require('express');
const mysql = require('mysql');
const session = require('express-session')
// Middleware
const cors = require('cors');
require('dotenv').config()

// Creating an instance of the express application
const app = express();
app.use(cors());
app.use(express.json())



// Connect to MySQL database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: `${process.env.VITE_DB_PASSWORD}`,
    database: 'qrcode_db'
})


// Add a 'connect' event listener
db.connect((error) => {
    if (error) {
        console.error('Error connecting to the database:', error);
        return;
    }
    console.log('Successfully connected to the database');
});

// Dummy user credentials
const dummyUser = {
    email: 'dummy@example.com',
    password: 'password123',
};


app.use(
    session({
        secret: process.env.VITE_SECRET_KEY,
        resave: false,
        saveUninitialized: true,
        cookie: {secure: false}
    })
);

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (email === dummyUser.email && password === dummyUser.password) {
        req.session.user = { email: dummyUser.email };
        res.json({ message: 'Login Successful!' })
    }
    else {
        res.status(401).json({ error: 'Invalid credentials!' });
    }
})

app.post('/logout', (req, res)=>{
    req.session.destroy();
    res.json({message: 'Logout Successful'});
})



// Defines port in which the server is to be launched
// During deployment it will assign any of the available ports to our server.
const port = process.env.PORT || 5000;

app.get('/qrcodes', (req, res) => {
    const getQuery = 'SELECT * FROM qrinfo';
    db.query(getQuery, (error, result) => {
        if (error) {
            console.error('Error fetching data:', error);
            res.status(500).json({ error: 'An error occurred while fetching data.' });
        }
        else {
            res.json(result);
        }
    })
})
app.post('/qrcodes', (req, res) => {
    const { content, thumbnail, scannedOn } = req.body;
    const postQuery = 'INSERT INTO qrinfo (content, thumbnail, scanned_date) VALUES (?, ?, ?)';

    db.query(postQuery, [content, thumbnail, scannedOn], (error, result) => {
        if (error) {
            console.error('Error saving data', error)
        }
        else {
            console.log('Data saved successfully', result.insertedId)
            res.send('Data saved successfully')
        }
    })
})

app.delete('/qrcodes/:id', (req, res) => {
    const { id } = req.params;
    const deleteQuery = 'DELETE FROM qrinfo WHERE id = ?';

    db.query(deleteQuery, [id], (error, result) => {
        if (error) {
            console.error('Failed to delete query', error);
            res.status(500).json({ error: "Failure reported in deleting entry" });
        }
        else {
            console.log('Deleted entry');
            res.json({ message: 'Deleted entry successfully' });
        }
    })
})

// Defining a URL and the response the users will get when they go to that url.
app.get('/', (request, response) => {
    response.send('Hello from my qr-scanner server')
})

// Set the port at which the server should listen for incoming requests
app.listen(port, () => {
    console.log(`QR Scanner server is running on port ${port}`);
})
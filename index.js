// Import express from nodejs 
const express = require('express');
const mysql = require('mysql');
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
    password:`${process.env.VITE_DB_PASSWORD}`,
    database:'db_demo'
})

// Add a 'connect' event listener
db.connect((error) => {
    if (error) {
        console.error('Error connecting to the database:', error);
        return;
    }
    console.log('Successfully connected to the database');
});


// Defines port in which the server is to be launched
// During deployment it will assign any of the available ports to our server.
const port = process.env.PORT || 5000;

// Defining a URL and the response the users will get when they go to that url.
app.get('/', (request, response) =>{
    response.send('Hello from my qr-scanner server')
})

// Set the port at which the server should listen for incoming requests
app.listen(port, ()=>{
    console.log(`QR Scanner server is running on port ${port}`);
})
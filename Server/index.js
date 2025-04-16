import axios from 'axios';
import { google } from 'googleapis';
import express from "express"; 
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2'; 
import {fetchAddExercises, fetchExercises, fetchData } from './middleware.js';
import dataSearch from './dataSearch.js';
import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';

const app = express();

app.use(cors());

// app.use(cors({ origin: (origin, callback) => callback(null, origin === 'http://172.20.10.2') }));

// app.use(
//     cors({
//       origin: (origin, callback) => {
//         // Allow specific origins or requests with no origin (e.g., mobile apps, Postman)
//         const allowedOrigins = ['http://172.20.10.2:3000'];
//         if (!origin || allowedOrigins.includes(origin)) {
//           callback(null, true);
//         } else {
//           callback(new Error('Not allowed by CORS'));
//         }
//       },
//     })
//   );
  

dotenv.config();

app.get('/routine/:name/add/:checkedData/:exercises', async (req,res) => { 
    res.header('Content-Security-Policy', "default-src 'self'; img-src 'self'; script-src 'self'; style-src 'self';");
    // const addedExercises = ;
    // const data = ;

    // pass to backend and create for loop for every item in checkedData array
    const response = await fetchAddExercises(req.params.checkedData, req.params.exercises)
    return res.send(response)

});

app.get("/routine/:name/:index", async (req,res) => { 
    
    res.header('Content-Security-Policy', "default-src 'self'; img-src 'self'; script-src 'self'; style-src 'self';");
    const route  = req.params.name;
    const index = req.params.index;

    // console.log(index);

    if (index){ 
        const buttonDataString = req.query.buttonData;
        const buttonData = JSON.parse(decodeURIComponent(buttonDataString)); // Parse it back to an array
        return res.send(await fetchData(route, index, buttonData))
    }

    return res.send(await fetchData(route));  
});

// GET EXERCISES NAMES FOR ROUTINES
app.get("/routine/:name", async (req,res) => {
    console.log('getting data');
    res.header('Content-Security-Policy', "default-src 'self'; img-src 'self'; script-src 'self'; style-src 'self';");
    res.send(await fetchData(req.params.name));  

});

// GET ALL EXERCISES FOR PARTICULAR EXERCISE (ADD NEW)
app.get("/routine/:name/add/:exercise", async (req,res) => {

    res.header('Content-Security-Policy', "default-src 'self'; img-src 'self'; script-src 'self'; style-src 'self';");
    res.send(await fetchExercises(req.params.exercise));  

});


app.get("/:type/:exerciseName", async (req,res) => { 
    
    res.header('Content-Security-Policy', "default-src 'self'; img-src 'self'; script-src 'self'; style-src 'self';");
    const string  = req.params.type;
    const exerciseName = req.params.exerciseName;
    const response = await dataSearch(string, exerciseName);  
    return response
})

// POST ROUTINE RECORDS
app.use(express.json())

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'gymgainz',
    port: 3306
  });

db.connect(err => {
if (err) {
    console.error('Error connecting to MySQL:', err.stack);
    return;
}
});

app.post("/routine/:name/record", (req, res) => {

    const { user, exercise, weight, sets, reps } = req.body;

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];

    const record = { 
        Date: formattedDate,
        exercise,
        weight,
        numberOfSets: sets,
        numberOfTimes: reps
    };

    console.log(record);

    /// Validate and sanitize the user variable
    const tableName = `gymgainz.${user.replace(/[^a-zA-Z0-9_]/g, '')}`;

    // Prepare the SQL statement
    const sql = `INSERT INTO ${user} (date, exercise, weight, number_of_sets, number_of_times) VALUES (?, ?, ?, ?, ?)`;

    db.query(sql, [record.Date, record.exercise, record.weight, record.numberOfSets, record.numberOfTimes], (err, data) => {

        // Validate required fields
        if (!user || !exercise || weight === undefined || sets === undefined || reps === undefined) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const tableName = `${user.replace(/[^a-zA-Z0-9_]/g, '')}`;

    // Format the current date
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];

    // Create the record object
    const record = { 
        Date: formattedDate,
        exercise,
        weight,
        numberOfSets: sets,
        numberOfTimes: reps
    };

    // Prepare the SQL statement
    const sql = `INSERT INTO ${tableName} (date, exercise, weight, number_of_sets, number_of_times) VALUES (?, ?, ?, ?, ?)`;

    // Execute the query
    db.query(sql, [record.Date, record.exercise, record.weight, record.numberOfSets, record.numberOfTimes], (err, data) => {
        if (err) {
            console.error("Error inserting record:", err); // Log full error
            return res.status(500).json({ message: 'Unsuccessful', error: err.message });
        }
        res.status(201).json({ message: 'Record added successfully' });
    });
    });
});

app.post("/login", (req,res) => {
    console.log('checking')
    const { username, password } = req.body; 

    const CheckPassword = "SELECT password FROM users WHERE username = ? "

    db.query(CheckPassword, username, (err, results) => {
        try{
            if (results[0].password === password){
                const jwtSecret = crypto.randomBytes(64).toString("hex");
                const token = jwt.sign({ id: username }, jwtSecret, { expiresIn: "1d" });
                return res.status(200).json({ response: "200", token: token });
            } else{
                res.status(500).json({message: 'Password'})
            }
        } catch(error){
            return res.status(500).json({message: 'Username does not exist!'})
        }

    })
});

app.post("/register", (req, res) => {

    const { name, username, password } = req.body;

    const CheckExisting = "SELECT * FROM users WHERE username = ?";

    db.query(CheckExisting, username, (err, results) => {

        console.log(results.length);
        if (err) {
            return res.status(500).json({message: 'Error querying Database'});

        } else if (results.length > 0) {
          return res.status(500).json({message: 'User already exists, please login using your username or reset your password.'});

        } else {

            const user = { 
                name: name,
                username: username,
                password: password,
            };        
            
            const AddUser = 'INSERT INTO users (name, username, password) VALUES (?, ?, ? )';

            db.query(AddUser, [user.name, user.username, user.password], (err, data) => {
        
                if(err) {
                   return res.status(500).json({error: 'Unable to Add User'});
                }  
                // 2nd Query: Check if a table with the username exists and create if not
                    const createTableQuery = `
                    CREATE TABLE IF NOT EXISTS \`${username}\` (
                    date DATE NOT NULL,
                    exercise VARCHAR(255) NOT NULL,
                    weight DECIMAL(10, 2)  NOT NULL,
                    number_of_sets INT NOT NULL,
                    number_of_times INT NOT NULL
                    )
                `;

                db.query(createTableQuery, (err, result) => {
                    if (err) {
                    return res.status(500).send('Error creating user-specific table');
                    }
                    
                });
                const jwtSecret = crypto.randomBytes(64).toString("hex");
                const token = jwt.sign({ id: username }, jwtSecret, { expiresIn: "1d" });
                return res.json({token: token})
            });
        }
    });
});

app.post("/record", (req, res) => {

    const params = req.body;
    const records = `SELECT * FROM ${params.user} `

    db.query(records, (err, data) => {
        if(err) {
            console.error('Error executing query', err);
            return res.status(500).json({ error: 'Database query failed' });
        }  
        res.json(data);
    })
})

app.post("/getPrev", (req, res) => { 
    
    // const user = req.body;
    const records = `SELECT * FROM ${req.body.user} `

    db.query(records, (err, data) => {
        if(err){
            console.error('Error executing query', err);
            return res.status(500).json({ error: 'Database query failed' });
        }  else{
            const returnedData = [];
            //Make data structure
            data.forEach( async (item) => {
                const returnedDataItem = [item.exercise, await dataSearch(item.exercise)] // returns array with [ [0,1], [0,1], [0,1] ]
                // returnedDataItem[2] = [item.weight, item.number_of_times, item.number_of_sets]
                // returnedData.push(returnedDataItem)
                // console.log(returnedData);
            })
            // console.log(returnedData);
        }
    })

})



app.listen(3001, (req, res) => console.log("running on 3001"));
import axios from 'axios';
import { google } from 'googleapis';
import express from "express"; 
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2'; 
import {fetchAddExercises, fetchExercises, fetchData} from './middleware.js';
import dataSearch from './dataSearch.js';

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
    database: 'gymgainz'
  });

db.connect(err => {
if (err) {
    console.error('Error connecting to MySQL:', err.stack);
    return;
}
});

app.post("/routine/:name/record", (req, res) => {

    const { exercise, weight, sets, reps } = req.body;

    const record = { 
        Date: new Date(),
        exercise,
        weight,
        numberOfSets: sets,
        numberOfTimes: reps
    };

    const sql = 'INSERT INTO gymgainz.records (date, exercise_name, weight, sets, reps) VALUES (?, ?, ?, ?, ?)';

    db.query(sql, [record.Date, record.exercise, record.weight, record.numberOfSets, record.numberOfTimes], (err, data) => {

        if(err) {
            console.log(err)
        }  
        res.status(201).json({ message: 'Record added successfully' });
    });
});

app.post("/login", (req,res) => {
    console.log('checking')
    const { username, password } = req.body; 

    const CheckPassword = "SELECT password FROM users WHERE username = ? "

    db.query(CheckPassword, username, (err, results) => {
        try{
            if (results[0].password === password){
                return res.status(200).json({ response: "200" });
            } else{
                console.log('password does not match');
            }
        } catch(error){
            return res.json({message:error})
        }

    })
});

app.post("/register", (req, res) => {

    const { name, username, password } = req.body;

    const CheckExisting = "SELECT * FROM users WHERE username = ?";

    db.query(CheckExisting, user.username, (err, results) => {
        if (err) {
          console.error("Error querying the database:", err);
          return;

        } if (results.length > 0) {
          return res.status(500);

        } else {

            const user = { 
                name: name,
                username: username,
                password: password,
                records: {}
            };        
            
            const AddUser = 'INSERT INTO users (name, username, password) VALUES (?, ?, ? )';

            db.query(AddUser, [user.name, user.username, user.password], (err, data) => {
        
                if(err) {
                   return res.status(500).json({error: 'Unable to Add User'});
                }  
                return res.json({message: `Welcome to Gymgainz,${name}`})
            });
        }
    });
});

app.get("/record", (req, res) => {

    const { username, password } = req.body;

    const records = `SELECT records FROM gymgainz.user.username `

    db.query(records, (err, data) => {
        if(err) {
            console.error('Error executing query', err);
            return res.status(500).json({ error: 'Database query failed' });
        }  
        res.json(data);
    })
})


app.listen(3001, (req, res) => console.log("running on 3001"));
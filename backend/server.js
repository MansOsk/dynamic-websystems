/*------------INIT------------*/
const https = require('https');
const fs = require('fs');
const path = require('path');

require('dotenv').config();

const express = require('express');

const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

/* var options = {
     key: fs.readFileSync('server.key'),
     cert: fs.readFileSync('server.cert'),
}

var server = https.createServer(options, app).listen(port, function(){
     console.log("Express server listening on port " + port);
}); */

/* ----------MongoDB------------*/
let dbPath = 'mongodb://localhost/mydb';
let dboptions = {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false}

const db = mongoose.connect(dbPath, dboptions);

db.then(() => {
     console.log('MongoDB connected');
 }, error => {
     console.log(error, 'error');
})

/*-----------Routing----------- */
app.get('/api', (req, res) => res.send('Welcome to the api'));

const user = require("./api/user/user.js");  // Userinfo.
app.use('/api/user', user);

const household = require("./api/household/household.js");  // Household, user has a household separted by houseid.
app.use('/api/household', household);

const grid = require("./api/grid/grid.js");  // Summarize total power accumulated. 
app.use('/api/grid', grid);

const manager = require("./api/manager/manager.js");   // Manager, connection with grid and manager stuff. 
app.use('/api/manager', manager);

/*Authenication stuff */
app.use(passport.initialize());    // Passport middleware
require("./api/user/config/passport")(passport);  // Passport config

// Launch app, always last!!!
app.listen(port, function() {
     console.log("Running FirstRest on Port "+ port)
})


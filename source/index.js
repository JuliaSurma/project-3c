const data = require("../app/data.js");
const db = require("../app/connection.js")

const express = require("express");

const path = require('path');
const crypto = require('crypto');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile); // todo - check if needed
app.use(express.static('public'));

app.set('views', path.join(__dirname + '/views')); // todo - check if needed

const { users, schedules} = data; 


app.get('/',  (_, res) => {
    res.render("index",  { title: 'My Page', text: 'Welcome on schedule'});
});

app.get('/users', (req, res) => {
  res.render('users', {title : "All users", text: 'Users List', users})
 });


app.get('/users/new', (req, res) => {
   res.render('NewUser', {title: 'Create new user', text: 'New User Form'});
 });


 app.post('/users', function (req, res) {
  const userNew = req.body;

  userNew.password = crypto.createHash('sha256').update(userNew.password).digest('base64');
  users.push(userNew);
  res.redirect('users');
});

app.get('/users/:userId', (req, res) => {
    const userId = Number(req.params.userId);
    if (users[userId] === undefined) {
      res.status(404).render('error', { title: 'Error'});
    }
    res.render('singleUser', { title: 'userId', userId, user: users[userId] });
  });



app.get('/schedules/new', (req, res) => {
  res.render('NewSchedule', {title: 'Create new schedule', text: 'New Schedule Form'});
 });

 
 app.post('/schedules/new', (req, res)=> {
  const { user_id, day, start_at, end_at } = req.body;
  
  db.query('INSERT INTO schedule (user_id, day, start_at, end_at) VALUES ($1, $2, $3, $4)', [user_id, day, start_at, end_at], (error, results) => {
    if (error) {
      
    }
    // res.status(201).send(`Schedule added with ID: ${JSON.stringify(results)}`);
    const NewSchedule = req.body;
    schedules.push(NewSchedule);
    res.render('NewSchedule'); 
  })} )


// get all schedules
app.get('/schedules', (req, res) => {
    res.render('schedules', { title: 'Schedules', text: 'Check all schedules', schedules });
        });

app.post('/schedules', function (req, res) {
          const NewSchedule = req.body;
        // response = {
        // user_id: req.body.user_id,
        // day: req.body.day,
        // start_at: req.body.start_at,
        // end_at: req.body.end_at,
        // };
        schedules.push(NewSchedule)
        res.redirect('schedules');
        })


// get schedule per user
app.get('/users/:userId/schedules', (req, res) => {
  const userId = req.params.userId;
  const userSchedule = [];
  for (let i = 0; i < schedules.length; i++) {
    if (schedules[i].user_id === Number(userId)) {
      userSchedule.push(schedules[i]);
    }
  }
  res.render('singleSchedulesUser',  {title: 'ScheduleforspecificUser', text: 'Schedule User', users, userId, user: users[userId], schedules, userSchedule});
});



app.listen(3000,
function(err){
  if (err) console.log("Error in server setup")
  console.log("Server listening on Port", 3000);
});

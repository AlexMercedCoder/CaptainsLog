const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const methodOverride = require('method-override')
const mongoose = require('mongoose');
const db = mongoose.connection;
const host='mongodb://localhost:27017/';
const subdb = 'gastuff';
const moment = require('moment');
const dbupdateobject = { useNewUrlParser:true, useUnifiedTopology:true, useFindAndModify:false}
const bcrypt = require('bcrypt');
const session = require('express-session');
require('dotenv').config();
/////////////////////
//DATABASE
/////////////////////

// Configuration
const mongoURI = process.env.CLUSTER;

// Connect to Mongo
mongoose.connect( mongoURI, dbupdateobject );

// Connection Error/Success
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
db.on('connected', () => console.log('mongo connected: ', mongoURI));
db.on('disconnected', () => console.log('mongo disconnected'));
db.on( 'open' , ()=>{
  console.log('Connection made!');
});

//Schema
const Logs = require('./models/logs.js');
const Users = require('./models/users.js');

/////////////////////////
//RUNTIME DATA
/////////////////////////

/////////////////////
//MIDDLEWARE
/////////////////////
app.use(express.urlencoded({extended:false}));
app.use(methodOverride('_method'));
app.use(session({
	  secret: "feedmeseymour",
	  resave: false,
	  saveUninitialized: false
}));

/////////////////////
//Listener
/////////////////////
app.listen(port, () => console.log(`Hello Alex I'm listening on ${port}!`))


/////////////////////
//User Route
/////////////////////
//user Route
app.get('/', (req, res) => res.render('main.ejs'))

app.get('/new', (req, res) => res.render('newuser.ejs'))

app.post('/new', (req, res)=>{
    console.log(req.body)
    req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    Users.create(req.body, (error, createdUser)=>{
        console.log(createdUser)
        res.redirect('/');
    });
});

app.get('/login', (req, res) => res.render('login.ejs'))

app.get('/logout', (req, res) => {
    req.session.destroy((err)=>{
       if(err){
           res.redirect('/index')
       } else {
           res.redirect('/')
       }
   });})

app.post('/login', (req, res)=>{
    Users.findOne({username: req.body.username}, (error, user)=>{
        if (user === null){
            res.redirect('/');
        }else{
        console.log(user);
        if (bcrypt.compareSync(req.body.password, user.password)){
            req.session.login = true;
            req.session.user = req.body.username;
            console.log('correct password');
            res.redirect('/index');} else{console.log('wrong password')
                res.redirect('/')};}
    });
});

/////////////////////
//Static Files
/////////////////////
app.use(express.static('public'));

/////////////////////
//Index Routes
/////////////////////
app.get('/index/', (request, response) => {
    if(request.session){
    if (request.session.login === true){
        Logs.find({user: request.session.user}, (error, data)=>{
        response.render('index.ejs', {
            data: data,
            tabTitle: 'Index',
            moment:moment
        });
    });} else {response.redirect('/login')}}
    else{
        response.redirect('/');
    }
});


/////////////////////
//Create Routes
/////////////////////
app.post('/index/', (req, res) => {
    req.body.user = req.session.user;
    if(req.body.shipIsBroken === 'on'){ //if checked, req.body.readyToEat is set to 'on'
        req.body.shipIsBroken = true;
    } else { //if not checked, req.body.readyToEat is undefined
        req.body.shipIsBroken = false;
    }
    Logs.create(req.body, (error, created)=>{
        res.redirect('/index');
    });
});

app.get('/index/new', (req, res) => {
    if(req.session){
    if (req.session.login === true){
    res.render('new.ejs',
        {
            tabTitle: 'Create'
        });} else {res.redirect('/login')}}
        else{
            res.redirect('/');
        }
});

/////////////////////
//Show Routes
/////////////////////
app.get('/index/:indexOf', function(req, res){
        Logs.findById(req.params.indexOf, (err, foundData)=>{
            res.render('show.ejs', {
                data:foundData,
                tabTitle: 'Show'
            });
        });
    });

/////////////////////
//Delete Route
/////////////////////
app.delete('/index/:indexOf', (req, res) => {
    Logs.findByIdAndRemove(req.params.indexOf, (err, data)=>{
        res.redirect('/index');
    });
});

/////////////////////
//Update Routes
/////////////////////
app.get('/index/:indexOf/edit', (req, res)=>{
    Logs.findById(req.params.indexOf, (err, foundData)=>{
        res.render(
    		'edit.ejs',
    		{
    			data: foundData,
                tabTitle: 'edit'

    		}
    	);
    });
});

app.put('/index/:indexOf', (req, res) => {
    if(req.body.shipIsBroken === 'on'){ //if checked, req.body.readyToEat is set to 'on'
        req.body.shipIsBroken = true;
    } else { //if not checked, req.body.readyToEat is undefined
        req.body.shipIsBroken = false;
    }
    Logs.findByIdAndUpdate(req.params.indexOf, req.body, {new:true}, (err, updatedModel)=>{
        res.redirect('/index');
    });
});

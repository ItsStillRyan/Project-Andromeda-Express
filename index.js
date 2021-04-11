const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
require("dotenv").config();
const session = require('express-session')
const flash = require('connect-flash')
const csrf = require('csurf')

// create an instance of express app
let app = express();

// set the view engine
app.set("view engine", "hbs");

// static folder
app.use(express.static("public"));

// setup wax-on
wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");

//SESSIONS
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}))


//GLOBAL MIDDLEWARE
app.use(function(req,res,next){
    res.locals.user = req.session.user
    next()
})

//FLASH
app.use(flash())
app.use(function (req, res, next) {
    res.locals.success_messages = req.flash("success_messages")
    res.locals.error_messages = req.flash("error_messages")
    next()
})

//FORMS
app.use(
  express.urlencoded({
    extended: false
  })
);

//CSRF
app.use(csrf())
app.use(function (req, res, next) {
    if (req.csrfToken) {
        res.locals.csrfToken = req.csrfToken();
    }
    next();
})

async function main() {
    const dashboardRoute = require('./routes/dashboard')
    const telescopeRoute = require('./routes/telescopes')
    const usersRoute = require('./routes/users')
    
    app.use('/dashboard', dashboardRoute)
    app.use('/telescopes', telescopeRoute)
    app.use('/users', usersRoute)
}

main();

app.listen(3000, () => {
  console.log("Server Active, Port 3000");
});
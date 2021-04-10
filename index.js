const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
require("dotenv").config();
const session = require('express-session')
const flash = require('connect-flash')

// create an instance of express app
let app = express();

// set the view engine
app.set("view engine", "hbs");

// static folder
app.use(express.static("public"));

// setup wax-on
wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");

app.use(session({
    secret: '2E9C3F343CA7F6D5769233CCAC261',
    resave: false,
    saveUninitialized: true
}))

app.use(flash())

app.use(function (req, res, next) {
    res.locals.success_messages = req.flash("success_messages")
    res.locals.error_messages = req.flash("error_messages")
    next()
})

// enable forms
app.use(
  express.urlencoded({
    extended: false
  })
);

async function main() {
    const dashboardRoute = require('./routes/dashboard')
    const telescopeRoute = require('./routes/telescopes')
    const usersRoute = require('./routes/users')
    
    app.use('/', dashboardRoute)
    app.use('/', telescopeRoute)
    app.use('/users', usersRoute)
}

main();

app.listen(3000, () => {
  console.log("Server Active, Port 3000");
});
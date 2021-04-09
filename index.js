const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
require("dotenv").config();
const session = require('express-session')

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

// enable forms
app.use(
  express.urlencoded({
    extended: false
  })
);

async function main() {
    const telescopeList = require('./routes/telescopes')
    const users = require('./routes/users')
    app.use('/', telescopeList)
    app.use('/users', users)
}

main();

app.listen(3000, () => {
  console.log("Server Active, Port 3000");
});
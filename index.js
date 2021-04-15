const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
require("dotenv").config();
const session = require('express-session')
const flash = require('connect-flash')
const csrf = require('csurf')
const cors = require('cors')

// create an instance of express app
let app = express();

// set the view engine
app.set("view engine", "hbs");

// static folder
app.use(express.static("public"));

// setup wax-on
wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");

//CORS
app.use(cors())

//SESSIONS
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}))

//FLASH
app.use(flash())
app.use(function (req, res, next) {
    res.locals.success_messages = req.flash("success_messages")
    res.locals.error_messages = req.flash("error_messages")
    next()
})


//GLOBAL MIDDLEWARE
app.use(function (req, res, next) {
    res.locals.user = req.session.user
    next()
})


//FORMS
app.use(
    express.urlencoded({
        extended: false
    })
);

//CSRF
const csurfInstance = csrf();
app.use(function (req, res, next) {
  if (req.url === '/checkout/process_payment' || 
      req.url.slice(0,5) == '/api/') {
      return next()
  }
  csurfInstance(req, res, next)
})

app.use(function (req, res, next) {
    if (req.csrfToken) {
        res.locals.csrfToken = req.csrfToken();
    }
    next();
})

//ROUTES
const dashboardRoute = require('./routes/dashboard')
const telescopeRoute = require('./routes/telescopes')
const usersRoute = require('./routes/users')
const cartRoute = require('./routes/cart')
const checkoutRoute = require('./routes/checkout')
const ordersRoute = require('./routes/order')

const api = {
    'telescope': require('./routes/api/telescopes'),
    'cart': require('./routes/api/cart'),
    'user': require('./routes/api/users')
}

async function main() {

    app.use('/dashboard', dashboardRoute)
    app.use('/telescope', telescopeRoute)
    app.use('/users', usersRoute)
    app.use('/cart', cartRoute)
    app.use('/checkout', checkoutRoute)
    app.use('/orders', ordersRoute)
    app.use('/api/telescope', express.json(), api.telescope)
    app.use('/api/cart', express.json(), api.cart)
    app.use('/api/users', express.json(), api.user)
}

main();

app.listen(3000, () => {
    console.log("Server Active, Port 3000");
});
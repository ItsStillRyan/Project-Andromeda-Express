const express = require("express");
const router = express.Router()
const { checkIfAuthenticated } = require('../middlewares')

router.get('/',checkIfAuthenticated, (req,res)=>{
    res.render('landing/dashboard')
})


module.exports = router;
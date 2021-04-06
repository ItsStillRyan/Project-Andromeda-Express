const express = require("express");
const router = express.Router()

const {Telescope} = require("../models")

router.get('/', async (req,res)=>{
    let telescopes = await Telescope.collection().fetch()
    res.render('telescopes/index', {
        'telescopes':telescopes.toJSON()
    })
})


module.exports = router
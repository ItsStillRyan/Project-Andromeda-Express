const express = require('express')
const router = express.Router();

const pDal = require('../../dal/telescopes')

router.get('/', async(req,res)=>{
    res.send(await pDal.getAllTelescope())
})

module.exports = router;
const express = require("express");
const router = express.Router()

const {Telescope} = require("../models")

const {bootstrapField, createTelescopeForm} = require('../forms')
//rendering full product list
router.get('/', async (req,res)=>{
    let telescopes = await Telescope.collection().fetch()
    res.render('telescopes/index', {
        'telescopes':telescopes.toJSON()
    })
})

//telescope forms 
router.get('/telescope/create', async (req,res)=>{
    const telescopeForm = createTelescopeForm()
    res.render('telescopes/create',{
        'form':telescopeForm.toHTML(bootstrapField)
    })
})

router.post('/telescope/create', async (req,res)=>{
    const telescopeForm = createTelescopeForm()
    telescopeForm.handle(req, {
        'success': async (form) => {
            const telescope = new Telescope()
            telescope.set(form.data)
            await telescope.save()
        },
        'error': async (form) => {
            res.render('telescopes/create', {
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})


module.exports = router
const express = require("express");
const router = express.Router()

const {Telescope} = require("../models")

const {bootstrapField, createTelescopeForm} = require('../forms')
//rendering full product list
router.get('/telescope', async (req,res)=>{
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
            res.redirect('/telescope')
        },
        'error': async (form) => {
            res.render('telescopes/create', {
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/telescope/:telescope_id/update', async (req,res)=>{
    const telescopeId = req.params.telescope_id
    const telescope = await Telescope.where({
        'id':telescopeId
    }).fetch({
        require:true
    })

    const telescopeForm = createTelescopeForm()

    telescopeForm.fields.name.value = telescope.get('name')
    telescopeForm.fields.description.value = telescope.get('description')
    telescopeForm.fields.stock.value = telescope.get('stock')
    telescopeForm.fields.price.value = telescope.get('price')
    telescopeForm.fields.weight.value = telescope.get('weight')
    telescopeForm.fields.userLevel.value = telescope.get('userLevel')
    telescopeForm.fields.imagingType.value = telescope.get('imagingType')
    telescopeForm.fields.opticalDesign.value = telescope.get('opticalDesign')
    telescopeForm.fields.apertureRange.value = telescope.get('apertureRange')
    telescopeForm.fields.fratioRange.value = telescope.get('fratioRange')

    res.render('telescopes/update', {
        'form': telescopeForm.toHTML(bootstrapField),
        'telescope':telescope.toJSON()
    })
})


module.exports = router
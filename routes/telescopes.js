const express = require("express");
const router = express.Router()
const flash = require('connect-flash')

const { Telescope, Category, Brand } = require("../models")

const { bootstrapField, createTelescopeForm, createSearchForm } = require('../forms')

const { checkIfAuthenticated } = require('../middlewares')

const dal = require('../dal/telescopes')

// rendering full product list
router.get('/:telescope_id/detailed', checkIfAuthenticated, async (req, res) => {
    const telescopeId = req.params.telescope_id
    const telescope = await dal.getTeleId(telescopeId)
    const allCate = await dal.getAllCate()
    const allBrands = await dal.getAllBrands()


    const telescopeForm = createTelescopeForm(allCate, allBrands)

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
    telescopeForm.fields.category_id.value = telescope.get('category_id')
    telescopeForm.fields.brand_id.value = telescope.get('brand_id')
    telescopeForm.fields.image_url.value = telescope.get('image_url')

    let telescopes = await Telescope.collection().fetch({
        withRelated: ['category', 'brand']
    })
    res.render('telescopes/detailed', {
        'telescopes': telescopes.toJSON(),
        'form' : form.toHTML(bootstrapField)
    })
})

router.get('/', checkIfAuthenticated, async (req,res) => {
    const allCate = await dal.getAllCate()
    const allBrands = await dal.getAllBrands()
    let searchForm = createSearchForm(allCate, allBrands)
    let tele = Telescope.collection()
    searchForm.handle(req, {
        'empty': async (form) => {
            let telescopes = await tele.fetch({
                withRelated: ['category', 'brand']
            })
            res.render('telescopes/index', {
                'telescopes': telescopes.toJSON(),
                'form' : form.toHTML(bootstrapField)
            })
        },
        'error': async (form) => {
            let telescopes = await tele.fetch({
                withRelated: ['category', 'brand']
            })
            res.render('telescopes/index', {
                'telescopes': telescopes.toJSON(),
                'form' : form.toHTML(bootstrapField)
            })
        },
        'success': async (form) => {
            if (form.data.name) {
                tele = tele.where('name', 'like', '%' + req.query.name + '%')
            }
            if (form.data.min_stock) {
                tele = tele.where('stock', '>=',req.query.min_stock)
            }
            if (form.data.max_stock) {
                tele = tele.where('stock', '<=', req.query.max_stock)
            }
            if (form.data.min_price) {
                tele = tele.where('price', '>=',req.query.min_price)
            }
            if (form.data.max_price) {
                tele = tele.where('price', '<=', req.query.max_price)
            }
            if (form.data.category_id) {
                tele = tele.query('join', 'categories', 'category_id', 'categories.id')
                  .where('categories.id', 'like', '%' + req.query.category_id + '%')
            }

            let telescopes = await tele.fetch({
                withRelated: ['category', 'brand']
            })
            res.render('telescopes/index', {
                'telescopes': telescopes.toJSON(),
                'form' : form.toHTML(bootstrapField)
            })
        }
    })
})

//telescope forms 
//create
router.get('/create', checkIfAuthenticated, async (req, res) => {

    const allCate = await dal.getAllCate()
    const allBrands = await dal.getAllBrands()

    const telescopeForm = createTelescopeForm(allCate, allBrands)

    res.render('telescopes/create', {
        'form': telescopeForm.toHTML(bootstrapField),
    })
})
router.post('/create', checkIfAuthenticated, async (req, res) => {
    const allCate = await dal.getAllCate()
    const allBrands = await dal.getAllBrands()

    const telescopeForm = createTelescopeForm(allCate, allBrands)

    telescopeForm.handle(req, {
        'success': async (form) => {
            const telescope = new Telescope()
            telescope.set(form.data)
            await telescope.save()
            req.flash("success_messages", `${telescope.get('name')} added into Store`)
            res.redirect('/telescope')
        },
        'error': async (form) => {
            res.render('telescopes/create', {
                'form': form.toHTML(bootstrapField)
            })
            req.flash("error_messages", 'Review form again.')

        }
    })
})

//update
router.get('/:telescope_id/update', async (req, res) => {
    const telescopeId = req.params.telescope_id
    const telescope = await dal.getTeleId(telescopeId)
    const allCate = await dal.getAllCate()
    const allBrands = await dal.getAllBrands()


    const telescopeForm = createTelescopeForm(allCate, allBrands)

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
    telescopeForm.fields.category_id.value = telescope.get('category_id')
    telescopeForm.fields.brand_id.value = telescope.get('brand_id')
    telescopeForm.fields.image_url.value = telescope.get('image_url')


    res.render('telescopes/update', {
        'form': telescopeForm.toHTML(bootstrapField),
        'telescope': telescope.toJSON()
    })
})
router.post('/:telescope_id/update', async (req, res) => {
    const telescopeId = req.params.telescope_id
    const telescope = await dal.getTeleId(telescopeId)
    const allCate = await dal.getAllCate()
    const allBrands = await dal.getAllBrands()

    const telescopeForm = createTelescopeForm(allCate, allBrands)

    telescopeForm.handle(req, {
        'success': async (form) => {
            telescope.set(form.data)
            await telescope.save()
            req.flash("success_messages", `${telescope.get('name')} updated into Store`)
            res.redirect('/telescope')
        },
        'error': async (form) => {
            res.render('telescopes/update', {
                'form': form.toHTML(bootstrapField)
            })
            req.flash("error_messages", 'Review form again.')

        }
    })
})

//delete
router.get('/:telescope_id/delete', async (req, res) => {
    const telescopeId = req.params.telescope_id
    const telescope = await dal.getTeleId(telescopeId)
    res.render('telescopes/delete', {
        'telescope': telescope
    })
})
router.post('/:telescope_id/delete', async (req, res) => {
    const telescopeId = req.params.telescope_id
    const telescope = await dal.getTeleId(telescopeId)
    await telescope.destroy()
    req.flash("success_messages", `${telescope.get('name')} deleted!`)
    res.redirect('/telescope')
})

module.exports = router
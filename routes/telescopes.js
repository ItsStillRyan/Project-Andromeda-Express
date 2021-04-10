const express = require("express");
const router = express.Router()

const { Telescope, Category, Brand } = require("../models")

const { bootstrapField, createTelescopeForm } = require('../forms')

//rendering full product list
router.get('/telescope', async (req, res) => {
    let telescopes = await Telescope.collection().fetch({
        withRelated: ['category', 'brand']
    })
    res.render('telescopes/index', {
        'telescopes': telescopes.toJSON()
    })
})

//telescope forms 
//create
router.get('/telescope/create', async (req, res) => {

    const allCate = await Category.fetchAll().map((category) => {
        return [category.get('id'), category.get('name')]
    })
    const allBrands = await Brand.fetchAll().map((brand) => {
        return [brand.get('id'), brand.get('name')]
    })

    const telescopeForm = createTelescopeForm(allCate,allBrands)

    res.render('telescopes/create', {
        'form': telescopeForm.toHTML(bootstrapField),
    })
})
router.post('/telescope/create', async (req, res) => {
    const allCate = await Category.fetchAll().map((category) => {
        return [category.get('id'), category.get('name')]
    })
    const allBrands = await Brand.fetchAll().map((brand) => {
        return [brand.get('id'), brand.get('name')]
    })

    const telescopeForm = createTelescopeForm(allCate, allBrands)

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

//update
router.get('/telescope/:telescope_id/update', async (req, res) => {
    const telescopeId = req.params.telescope_id
    const telescope = await Telescope.where({
        'id': telescopeId
    }).fetch({
        require: true
    })
    const allCate = await Category.fetchAll().map((category) => {
        return [category.get('id'), category.get('name')]
    })
    const allBrands = await Brand.fetchAll().map((brand) => {
        return [brand.get('id'), brand.get('name')]
    })


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


    res.render('telescopes/update', {
        'form': telescopeForm.toHTML(bootstrapField),
        'telescope': telescope.toJSON()
    })
})
router.post('/telescope/:telescope_id/update', async (req, res) => {
    const telescope = await Telescope.where({
        'id': req.params.telescope_id
    }).fetch({
        require: true
    })
    const allCate = await Category.fetchAll().map((category) => {
        return [category.get('id'), category.get('name')]
    })
    const allBrands = await Brand.fetchAll().map((brand) => {
        return [brand.get('id'), brand.get('name')]
    })


    const telescopeForm = createTelescopeForm(allCate, allBrands)

    telescopeForm.handle(req, {
        'success': async (form) => {
            telescope.set(form.data)
            await telescope.save()
            res.redirect('/telescope')
        },
        'error': async (form) => {
            res.render('telescope/update', {
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})

//delete
router.get('/telescope/:telescope_id/delete', async (req, res) => {
    const telescope = await Telescope.where({
        'id': req.params.telescope_id
    }).fetch({
        require: true
    })

    res.render('telescopes/delete', {
        'telescope': telescope
    })
})
router.post('/telescope/:telescope_id/delete', async (req, res) => {
    const telescope = await Telescope.where({
        'id': req.params.telescope_id
    }).fetch({
        require: true
    })
    await telescope.destroy()
    res.redirect('/telescope')
})

module.exports = router
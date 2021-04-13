const express = require('express')
const router = express.Router();

const pDal = require('../../dal/telescopes')

const {Telescope} = require('../../models')

const {createTelescopeForm} = require('../../forms')

router.get('/', async(req,res)=>{
    res.send(await pDal.getAllTelescope())
})

router.post('/create', async (req, res) => {
    const allCate = await pDal.getAllCate()
    const allBrands = await pDal.getAllBrands()
    const telescopeForm = createTelescopeForm(allCate, allBrands)

    telescopeForm.handle(req, {
        'success': async (form) => {
            const telescope = new Telescope()
            telescope.set(form.data)
            await telescope.save()
            res.send(telescope)
        },
        'error': async (form) => {
            let errors = {}
            for (let key in form.fields) {
                if (form.fields[key].error) {
                    errors[key] = form.fields[key].error
                }
            }
            res.send(JSON.stringify(errors))
        }
    })
})

module.exports = router;
const express = require("express");
const router = express.Router()
const crypto = require('crypto')

const { User } = require('../../models')

const {createRegisterForm} = require('../../forms')

const {uDal} = require('../../dal/users')
const {UserService} = require('../../services/user_services')

//PASSWORD SCRAMBLER
const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256')
    const hash = sha256.update(password).digest('base64')
    return hash
}

//DISPLAY PROFILE
router.get('/profile/:users_id', async (req,res) => {
    const user = new UserService(req.params.users_id)
    if (!user) {
        res.send("not logged in")
    }else{
        res.send(await user.getUser())
    }
})

//CREATE PROFILE
router.post('/register', (req,res) => {
    const registerForm = createRegisterForm()
    registerForm.handle(req, {
        'success': async (form) => {
            const user = new User({
                'username': form.data.username,
                'password': getHashedPassword(form.data.password),
                'fname': form.data.fname,
                'lname': form.data.lname,
                'contact': form.data.contact,
                'email': form.data.email,
                'address': form.data.address,
                'postalCode': form.data.postalCode,
            })
            await user.save()
            res.send(user)
        },
        'error': async (form) => {
            let errors = {}
            for  (let key in form.fields) {
                if(form.fields[key].error) {
                    errors[key] = form.fields[key].error
                }
            }
            res.send(JSON.stringify(errors))
        }
    })
})





module.exports = router

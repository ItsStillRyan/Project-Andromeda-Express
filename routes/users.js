const express = require('express')
const router = express.Router()
const flash = require('connect-flash')
const crypto = require('crypto')

const {User} = require('../models')

const { bootstrapField, createRegisterForm, createLoginForm } = require('../forms')

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256')
    const hash = sha256.update(password).digest('base64')
    return hash
}

router.get('/register', (req,res)=>{
    const registerForm = createRegisterForm()
    res.render('users/create',{
        'form': registerForm.toHTML(bootstrapField)
    })
})
router.post('/register', (req,res)=>{
    const registerForm = createRegisterForm()
    registerForm.handle(req, {
        'success': async (form) => {
            const user = new User({
                'username': form.data.username,
                'password': getHashedPassword(form.data.password)
            })
            await user.save()
            req.flash("success_messages", 'User Successfully Registered')
            res.redirect('/users/login')
        },
        'error': async (form) => {
            res.render('users/create', {
                'form': form.toHTML(bootstrapField)
            })
        req.flash("error_messages", 'Invalid Entry')
        }
    })
})

router.get('/login', (req,res)=>{
    const loginForm = createLoginForm()
    res.render('users/login', {
        'form': loginForm.toHTML(bootstrapField)
    })
})
router.post('/login', (req,res)=>{
    const loginForm = createLoginForm()
    loginForm.handle(req, {
        'success': async (form) => {
            let user = await User.where({
                'username': form.data.username
            }).fetch({
                require:false
            })

            if (!user){
                req.flash("error_messages", 'Username or Password Invalid.')
                res.redirect('/users/login')
            } else {
                if (user.get('password') === getHashedPassword(form.data.password)){
                    req.session.user = {
                        id: user.get('id'),
                        username: user.get('username')
                    }
                    req.flash("success_messages", `Welcome back ${user.get('username')} `)
                    res.redirect('/users/profile')
                } else {
                    req.flash("error_messages", 'Username or Password Invalid.')
                    res.redirect('/users/login')
                }
            }
        },
        'error': (form) => {
            res.render('users/login', {
                'form':form.toHTML(bootstrapField)
            })
         req.flash("error_messages", 'Username or Password Invalid.')
        }
    })
})

router.get('/profile', (req,res) => {
    const user = req.session.user
    if(!user){
        res.redirect('/users/login')
    }else{
        res.render('users/profile', {
            'user':user
        })
    }
})

router.get('/logout', (req,res)=>{
    req.session.user = null;
    req.flash("success_messages", "Successfully Logged out")
    res.redirect('/users/login')
})

module.exports = router
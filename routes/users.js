const express = require('express')
const router = express.Router()

const {User} = require('../models')

const { bootstrapField, createRegisterForm, createLoginForm } = require('../forms')

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
                'password': form.data.password
            })
            await user.save()
            res.redirect('/users/login')
        },
        'error': async (form) => {
            res.render('users/create', {
                'form': form.toHTML(bootstrapField)
            })
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
                res.redirect('/users/login')
            } else {
                if (user.get('password') === form.data.password){
                    req.session.user = {
                        id: user.get('id'),
                        username: user.get('username')
                    }
                    res.redirect('/users/profile')
                } else {
                    res.redirect('/users/login')
                }
            }
        },
        'error': (form) => {
            res.render('users/login', {
                'form':form.toHTML(bootstrapField)
            })
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

module.exports = router
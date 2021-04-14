const express = require("express");
const router = express.Router()
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const { User, BlacklistedToken } = require('../../models')

const { createRegisterForm } = require('../../forms')

const { checkIfAuthenticatedJWT } = require('../../middlewares')

//TOKEN GEN


const generateAccessToken = (user, secret, expiresIn) => {
    return jwt.sign({
        'username': user.get('username'),
        'id': user.get('id'),
        'first name': user.get('fname'),
        'last name': user.get('lname'),
        'contact': user.get('contact'),
        'email': user.get('email'),
        'address': user.get('address'),
        'postalCode': user.get('postalCode')
    }, secret, {
        expiresIn: expiresIn
    })
}


//PASSWORD SCRAMBLER
const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256')
    const hash = sha256.update(password).digest('base64')
    return hash
}

//START OF ROUTER

//DISPLAY PROFILE
router.get('/profile', checkIfAuthenticatedJWT, async (req, res) => {
    const user = req.user
    res.send(user)
})

//CREATE PROFILE
router.post('/register', (req, res) => {
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
            for (let key in form.fields) {
                if (form.fields[key].error) {
                    errors[key] = form.fields[key].error
                }
            }
            res.send(JSON.stringify(errors))
        }
    })
})


//LOGIN
router.post('/login', async (req, res) => {
    let user = await User.where({
        'username': req.body.username
    }).fetch({
        require: false
    })

    if (user && user.get('password') == getHashedPassword(req.body.password)) {
        let accessToken = generateAccessToken(user, process.env.TOKEN_SECRET, '15m')
        let refreshToken = generateAccessToken(user, process.env.REFRESH_TOKEN_SECRET, '7d')
        res.send({
            accessToken, refreshToken
        })
    } else {
        res.send({
            'error': "Invalid Username or Password"
        })
    }
})

//REFRESH
router.post('/refresh', async (req, res) => {

    let refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        res.sendStatus(401)
    }

    let blacklistedToken = await BlacklistedToken.where({
        'token': refreshToken
    }).fetch({
        require: false
    })

    if (blacklistedToken) {
        res.status(401)
        return res.send('Refresh Token expired')
    }



    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
        if (err) {
            return res.sendStatus(403)
        }
        let accessToken = generateAccessToken(user, process.env.TOKEN_SECRET, '15m')
        res.send({
            accessToken
        })

    })


})

//Logout
router.post('/logout', async (req, res) => {
    let refreshToken = req.body.refreshToken
    if (!refreshToken) {
        res.sendStatus(401)
    } else {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
            if (err) {
                return res.sendStatus(403)
            }

            const token = new BlacklistedToken();
            token.set('token', refreshToken);
            token.set('date_created', new Date())
            await token.save()
            res.send({
                'message': 'Logged Out'
            })
        })
    }
})




module.exports = router

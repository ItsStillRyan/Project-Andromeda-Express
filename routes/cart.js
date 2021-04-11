const express = require("express");
const router = express.Router()
const flash = require('connect-flash')

const CartService = require('../services/cart_services')

router.get('/:telescope_id/add', async (req,res) => {
    let cart = new CartService(req.session.users.id)
    cart.addToCart(req.params.telescope_id, 1)
    res.flash('success_messages', 'Added to cart')
    res.redirect('/telescopes')
})
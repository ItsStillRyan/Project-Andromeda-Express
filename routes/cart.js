const express = require("express");
const router = express.Router()
const flash = require('connect-flash')

const CartService = require('../services/cart_services')


//display cart
router.get('/', async(req,res)=>{
    let cart = new CartService(req.session.user.id)
    res.render('cart/index', {
        'shopCart' : (await cart.getCart()).toJSON()
    })
})

//add to cart
router.get('/:telescope_id/add', async (req,res) => {
    let cart = new CartService(req.session.user.id)
    cart.addToCart(req.params.telescope_id, 1)
    res.flash("success_messages", 'Added to cart')
    res.redirect('/telescopes')
})


module.exports = router;
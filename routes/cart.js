const express = require("express");
const router = express.Router()
const flash = require('connect-flash')

const CartService = require('../services/cart_services')
const cDal = require('../dal/cart')

//display cart
router.get('/', async(req,res)=>{
    let cart = new CartService(req.session.user.id)
    const allItems = await cart.getCart();
    res.render('cart/index', {
        'shopCart' : allItems.toJSON()
    })
})


//add to cart
router.get('/:telescope_id/add', async (req,res) => {
    let cart = new CartService(req.session.user.id)
    await cart.addToCart(req.params.telescope_id, 1)
    req.flash("success_messages", 'Added to cart')
    res.redirect('/telescope')
})


//delete
router.get('/:telescope_id/remove', async(req,res) => {
    let cart = new CartService(req.session.user.id)
    await cart.remove(req.params.telescope_id) 
    req.flash("success_messages", 'Removed to cart')
    res.redirect('/cart')
})

//update quant
router.post('/:telescope_id/quantity/update', async(req,res) => {
    let cart = new CartService(req.session.user.id)
    await cart.setQuantity(req.params.telescope_id, req.body.newQuantity, req.body.quantity) 
    req.flash("success_messages", 'Quantity updated')
    res.redirect('/cart')
})

module.exports = router;
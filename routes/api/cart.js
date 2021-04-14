const express = require("express");
const router = express.Router()

const CartService = require('../../services/cart_services')
const cDal = require('../../dal/cart')

//display cart
router.get('/:users_id', async(req,res)=>{
    let cart = new CartService(req.params.users_id)
    res.send(await cart.getCart())
})

//add to cart
router.get('/:users_id/:telescope_id/add', async (req,res) => {
    let cart = new CartService(req.params.users_id)
    res.send(await cart.addToCart(req.params.telescope_id, 1))
})


//delete
router.get('/:users_id/:telescope_id/remove', async(req,res) => {
    let cart = new CartService(req.params.users_id)
    res.send(await cart.remove(req.params.telescope_id) )
})

//update quant
router.post('/:users_id/:telescope_id/quantity/update', async(req,res) => {
    let cart = new CartService(req.params.users_id)
    res.send(await cart.setQuantity(req.params.telescope_id, req.body.newQuantity) )
})

module.exports = router;
const express = require("express");
const router = express.Router()

const CartService = require('../../services/cart_services')
const Stripe = require('stripe')(process.env.STRIPE_KEY_SECRET)

router.get('/:users_id', async (req, res) => {
    const cart = new CartService(req.params.users_id)

    let items = await cart.getCart()

    let lineItems = []
    let meta = []
    for (let item of items) {
        const lineItem = {
            'name': item.related('telescope').get('name'),
            'amount': item.related('telescope').get('price'),
            'quantity': item.get('quantity'),
            'currency': 'SGD'
        }
        if (item.related('telescope').get('image_url')) {
            lineItem['images'] = [item.related('telescope').get('image_url')]
        }
        lineItems.push(lineItem)

        meta.push({
            'telescope_id': item.get('telescope_id'),
            'quantity': item.get('quantity')
        })
    }

    let metaData = JSON.stringify(meta)
    const payment = {
        payment_method_types: ['card'],
        line_items: lineItems,
        success_url: process.env.STRIPE_SUCCESS_URL + '?sessionId={CHECKOUT_SESSION_ID}',
        cancel_url: process.env.STRIPE_ERROR_URL,
        metadata: {
            'orders': metaData
        }
    }

    let stripeSession = await Stripe.checkout.sessions.create(payment)
    res.render('checkout/checkout', {
        'sessionId': stripeSession.id, 
        'publishableKey': process.env.STRIPE_KEY_PUBLISHABLE
    })

})




module.exports = router
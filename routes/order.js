const express = require("express");
const router = express.Router()

const {Order} = require('../models')
const oDal = require('../dal/orders')
const {createOrdersForm, bootstrapField} = require('../forms')


router.get('/createOrder', async (req,res) => {
    // orderId = req.session.cart.id
    const allStatus = await oDal.getAllStatus()
    const allShipping = await oDal.getAllShipping()
    // const order = await oDal.getOrdersviaId(orderId)
    const orderForm = createOrdersForm(allShipping, allStatus)

    // orderForm.fields.orderNumber.value = order.get('orderNumber')
    // console.log(orderId)
    //logic for ordernum
    // let orderNum = order.get('orderNumber')
    // if(orderNum){
    //     return orderNum + 1
    // }
    // console.log(orderNum)
    
    res.render('orders/create', {
        'form': orderForm.toHTML(bootstrapField)
    })
})

router.post('/createOrder', async (req,res)=> {
    const allStatus = await oDal.getAllStatus()
    const allShipping = await oDal.getAllShipping()

    const orderForm = createOrdersForm(allShipping, allStatus)

    // orderForm.handle(req, {
    //     'success': async (form) => {
    //         const order = new Order()
    //         order.set('',form.data.orderNumber)
    //     }
    // })
})

router.get ('/', async (req,res) => {
    let order = await oDal.getAllOrders()
    console.log(order.toJSON())
    res.render('orders/orderList', {
        'shopOrders' : order.toJSON()
    })
})


module.exports = router
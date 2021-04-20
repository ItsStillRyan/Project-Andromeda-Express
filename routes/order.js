const express = require("express");
const router = express.Router()
const flash = require('connect-flash')

const {Order} = require('../models')
const oDal = require('../dal/orders')
const {createOrdersForm, updateStatusForm, bootstrapField} = require('../forms')


router.get('/createOrder', async (req,res) => {
    const user = req.session.user.id
    const allStatus = await oDal.getAllStatus()
    const allShipping = await oDal.getAllShipping()
    const orderForm = createOrdersForm(allShipping, allStatus)
    console.log(user)
    orderForm.fields.orderDate.value = new Date()
    orderForm.fields.users_id.value = user

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

//DISPLAY ALL ORDERS
router.get ('/', async (req,res) => {
    let order = await oDal.getAllOrders()
    console.log(order.toJSON())
    res.render('orders/orderList', {
        'shopOrders' : order.toJSON()
    })
})

//UPDATE STATUS
router.get('/:order_id/status', async (req,res) => {
    const order = await oDal.getOrdersviaId(req.params.order_id)
    const allStatus = await oDal.getAllStatus()
    const updateForm = updateStatusForm(allStatus)

    updateForm.fields.status_id.value = order.get('status_id')

    res.render('orders/update', {
        'form' : updateForm.toHTML(bootstrapField),
        'order': order.toJSON()
    })
})
router.post('/:order_id/status', async (req,res) => {
    const order = await oDal.getOrdersviaId(req.params.order_id)
    const allStatus = await oDal.getAllStatus()
    const updateForm = updateStatusForm(allStatus)

    updateForm.handle(req, {
        'success': async (form) => {
            order.set(form.data)
            await order.save()
            req.flash("success_messages", `Status Updated`)
            res.redirect('/orders')
        },
        'error': async (form) => {
            res.render('orders/update', {
                'form' : form.toHTML(bootstrapField)
            })
            req.flash("error_messages", "Error Updating Status")
        }
    })
})

//DELETE ORDER
router.get('/:order_id/delete', async(req,res) => {
    const order = await oDal.getOrdersviaId(req.params.order_id)
    res.render("orders/delete", {
        "order":order.toJSON()
    })
})
router.post('/:order_id/delete', async (req,res) => {
    const order = await oDal.getOrdersviaId(req.params.order_id)
    await order.destroy()
    req.flash("success_messages", `Order deleted!`)
    res.redirect("/orders")
})


module.exports = router
const express = require("express");
const router = express.Router()
const flash = require('connect-flash')

const { Order } = require('../models')
const oDal = require('../dal/orders')
const { createOrdersForm, updateStatusForm, createOrderSearchForm, bootstrapField } = require('../forms')
const { checkIfAuthenticated } = require('../middlewares')

router.get('/createOrder', checkIfAuthenticated, async (req, res) => {
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

router.post('/createOrder', async (req, res) => {
    const allStatus = await oDal.getAllStatus()
    const allShipping = await oDal.getAllShipping()

    const orderForm = createOrdersForm(allShipping, allStatus)
})

//DISPLAY ALL ORDERS
router.get('/', checkIfAuthenticated, async (req, res) => {

    const allStatus = await oDal.getAllStatus()
    const allShipping = await oDal.getAllShipping()
    let searchForm = createOrderSearchForm(allStatus,allShipping)
    let order = Order.collection()

    searchForm.handle(req, {
        'empty': async (form) => {
            let orders = await order.fetch({
                withRelated: ['status', 'shipping']
            })
            res.render('orders/orderList', {
                'shopOrders': orders.toJSON(),
                'form': form.toHTML(bootstrapField)
            })
        },
        'error': async (form) => {
            let orders = await order.fetch({
                withRelated: ['status', 'shipping']
            })
            res.render('orders/orderList', {
                'shopOrders': orders.toJSON(),
                'form': form.toHTML(bootstrapField)
            })
        },
        'success': async (form) => {
            if (form.data.status) {
                order = order.query('join', 'status', 'status_id', 'status.id')
                  .where('status.id', 'like', '%' + req.query.status + '%')
            }
            if (form.data.shipping_company) {
                order = order.query('join', 'shipping', 'shipping_id', 'shipping.id')
                  .where('shipping.id', 'like', '%' + req.query.shipping_company + '%')
            }
            if (form.data.userid) {
                order = order.where('users_id', 'like', '%' + req.query.userid + '%')
            }
            let orders = await order.fetch({
                withRelated: ['status', 'shipping']
            })
            res.render('orders/orderList', {
                'shopOrders': orders.toJSON(),
                'form': form.toHTML(bootstrapField)
            })
        },
    })





})

//UPDATE STATUS
router.get('/:order_id/status', checkIfAuthenticated, async (req, res) => {
    const order = await oDal.getOrdersviaId(req.params.order_id)
    const allStatus = await oDal.getAllStatus()
    const updateForm = updateStatusForm(allStatus)

    updateForm.fields.status_id.value = order.get('status_id')

    res.render('orders/update', {
        'form': updateForm.toHTML(bootstrapField),
        'order': order.toJSON()
    })
})
router.post('/:order_id/status', async (req, res) => {
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
                'form': form.toHTML(bootstrapField)
            })
            req.flash("error_messages", "Error Updating Status")
        }
    })
})

//DELETE ORDER
router.get('/:order_id/delete', checkIfAuthenticated, async (req, res) => {
    const order = await oDal.getOrdersviaId(req.params.order_id)
    res.render("orders/delete", {
        "order": order.toJSON()
    })
})
router.post('/:order_id/delete', async (req, res) => {
    const order = await oDal.getOrdersviaId(req.params.order_id)
    await order.destroy()
    req.flash("success_messages", `Order deleted!`)
    res.redirect("/orders")
})


module.exports = router
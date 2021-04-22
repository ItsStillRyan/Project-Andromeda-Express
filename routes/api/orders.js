const express = require("express");
const router = express.Router()
const flash = require('connect-flash')

const { Order } = require('../../models')
const oDal = require('../../dal/orders')
const { createOrdersForm, updateStatusForm, bootstrapField } = require('../../forms')

//CREATING ORDER
router.post('/createOrder', async (req, res) => {
    const allStatus = await oDal.getAllStatus()
    const allShipping = await oDal.getAllShipping()
    const orderForm = createOrdersForm(allShipping, allStatus)

    orderForm.fields.orderDate.value = new Date()

    orderForm.handle(req, {
        'success': async(form) => {
            const order = new Order({
                'orderDate': new Date(),
                'status_id': form.data.status_id,
                'shipping_id': form.data.shipping_id,
                'users_id': form.data.users_id
            })
            await order.save()
            res.send(order)
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

//GET ALL ORDERS ASSOSCIATED WITH USERID
router.get ('/:users_id', async (req,res) => {
    let order = await oDal.getOrdersviaUserId(req.params.users_id)
    res.send(order)
})

//GET SHIPPING




module.exports = router;
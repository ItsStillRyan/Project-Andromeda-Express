const { Order, Status, Shipping, Cart } = require("../models")


const getAllStatus = async () => {
    return await Status.fetchAll().map((status) => {
        return [status.get('id'), status.get('name')]
    })
}

const getAllShipping = async () => {
    return await Shipping.fetchAll().map((shipping) => {
        return [shipping.get('id'), shipping.get('name')]
    })
}

const getOrdersviaId = async (orders_id) => {
    return await Order.where({
        'id' : parseInt(orders_id)
    }).fetch({
        require: true,
        withRelated: ['status', 'shipping']
    })
}

const getAllOrders = async () => {
    return await Order.fetchAll({
        withRelated: ['status', 'shipping', 'users']
    })
}

const getCartItemsviaID = async (userId) => {
    return await Cart.where({
        'users_id':userId
    })
}

const getOrdersviaUserId = async (userId) => {
    return await Order.collection().where({
        'users_id': userId
    }).fetch({
        require: true,
        withRelated: ['status', 'shipping']
    })
}

module.exports = {
    getAllStatus, 
    getAllShipping,
    getOrdersviaId,
    getAllOrders,
    getCartItemsviaID,
    getOrdersviaUserId
}
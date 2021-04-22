const {Cart, CartConfirm} = require('../models')

const getCart = async (userId) => {
    return await Cart.collection().where({
        'users_id' : userId
    }).fetch({
        require:false,
        withRelated: ['telescope', 'user']
        
    })
}

const getCartByUserAndProduct = async (userId, telescopeId) => {
    const cartItem = await Cart.where({
        'users_id': userId,
        'telescope_id': telescopeId
    }).fetch({
        require: false,
        withRelated: ['telescope', 'telescope.category']
    })
    return cartItem
}

const getCartByUserAndProduct2 = async (userId, telescopeId) => {
    const cartItem = await CartConfirm.where({
        'users_id': userId,
        'telescope_id': telescopeId
    }).fetch({
        require: false,
        withRelated: ['telescope', 'telescope.category']
    })
    return cartItem
}

const getCartbyUser = async (userId) => {
    return await Cart.where({
        'users_id':userId
    })
}


module.exports = {getCart, getCartByUserAndProduct, getCartbyUser, getCartByUserAndProduct2}
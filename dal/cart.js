const {Cart} = require('../models')

const getCart = async (userId) => {
    return await Cart.collection().where({
        'users_id' : userId
    }).fetch({
        require:false,
        withRelated:['telescope','category']
    })
}

const getCartByUserAndProduct = async (userId, telescopeId) => {
    return await Cart.where({
        'users_id': userId,
        'telescope_id': telescopeId
    }).fetch({
        require: false
    })
}

module.exports = {getCart, getCartByUserAndProduct}
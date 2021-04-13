const {Cart} = require('../models')

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



module.exports = {getCart, getCartByUserAndProduct}
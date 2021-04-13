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
    return await Cart.where({
        'users_id': userId,
        'telescope_id': telescopeId
    }).fetch({
        require: false,
    })
}

const setQuantity = async (userId, telescopeId, newQuantity ) =>{
        console.log(userId, telescopeId, newQuantity)
        let cartItem = await getCartByUserAndProduct(userId, telescopeId).then(t => { return t } )
        // if (cartItem) {
            cartItem.set("quantity", newQuantity)
            await cartItem.save();
            return cartItem
        // }
        // return null
    }

module.exports = {getCart, getCartByUserAndProduct, setQuantity}
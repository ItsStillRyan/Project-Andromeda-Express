const {Cart} = require('../models')
const cDal = require('../dal/cart')

class CartService {
    constructor(users_id){
        this.users_id = users_id
    }

    async addToCart(telescopeId, quantity) {

        let cartItem = await cDal.getCartByUserAndProduct(this.users_id, telescopeId)

        if(!cartItem) {
            cartItem = new Cart({
                'users_id': this.users_id,
                'telescope_id': telescopeId,
                'quantity': quantity
            })
        }else{
            cartItem.set('quantity', cartItem.get('quantity') + quantity)
        }
        await cartItem.save()
        return cartItem
    }
}

module.exports = CartService

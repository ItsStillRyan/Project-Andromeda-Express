const {Cart} = require('../models')
const cDal = require('../dal/cart')

class CartService {
    constructor(user_id) {
        this.users_id = user_id
    }
    

    async getCart(){
        const allItems = await cDal.getCart(this.users_id);
        return allItems;
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

    async remove(telescopeId) {
        let cartItem = await cDal.getCartByUserAndProduct(this.users_id, telescopeId)
        if (cartItem) {
            await cartItem.destroy();
            return true
        }
        return false
    }


    async setQuantity(telescopeId, newQuantity){
        console.log(telescopeId, newQuantity)
        let cartItem = await cDal.getCartByUserAndProduct(this.users_id, telescopeId)
        console.log(await cDal.getCartByUserAndProduct(this.users_id, telescopeId))
        if (cartItem) {
            cartItem.set("quantity", newQuantity)
            await cartItem.save();
            return cartItem
        }
        console.log("NOT WORKING")
        return null
    }

}

module.exports = CartService

const { Cart, CartConfirm } = require('../models')
const cDal = require('../dal/cart')

class CartService {
    constructor(user_id) {
        this.users_id = user_id
    }

    async getCart() {
        const allItems = await cDal.getCart(this.users_id);
        return allItems;
    }

    async addToCart(telescopeId, quantity) {

        let cartItem = await cDal.getCartByUserAndProduct(this.users_id, telescopeId)

        if (!cartItem) {
            cartItem = new Cart({
                'users_id': this.users_id,
                'telescope_id': telescopeId,
                'quantity': quantity
            })
        } else {
            cartItem.set('quantity', cartItem.get('quantity') + quantity)
        }
        await cartItem.save()
        return cartItem
    }

    async addToCartConfirm(telescopeId, quantity) {

        let cartItem = await cDal.getCartByUserAndProduct2(this.users_id, telescopeId)

        if (!cartItem) {
            cartItem = new CartConfirm({
                'users_id': this.users_id,
                'telescope_id': telescopeId,
                'quantity': quantity
            })
        } else {
            cartItem.set('quantity', cartItem.get('quantity') + quantity)
        }
        await cartItem.save()
        return cartItem
    }

    async remove() {
        let cartItem = await cDal.getCart(this.users_id)
        if (cartItem) {
            await cartItem.destroy();
            return true
        }
        return false
    }
    async removeConfirm(telescopeId) {
        let cartItem = await cDal.getCartByUserAndProduct2(this.users_id, telescopeId)
        if (cartItem) {
            await cartItem.destroy();
            return true
        }
        return false
    }

    async setQuantity(telescopeId, newQuantity) {
        console.log(telescopeId, newQuantity)
        let cartItem = await cDal.getCartByUserAndProduct(this.users_id, telescopeId)
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

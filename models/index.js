const bookshelf = require('../bookshelf')

//TELESCOPES RELATIONSHIPS
const Telescope = bookshelf.model('Telescope', {
    tableName:'telescopes',
    category(){
        return this.belongsTo('Category')
    },
    brand(){
        return this.belongsTo('Brand')
    }

})
const Category = bookshelf.model('Category',{
    tableName: 'categories',
    telescope(){
        return this.hasMany('Telescope')
    }
})
const Brand = bookshelf.model('Brand', {
    tableName: 'brands',
    telescope(){
        return this.hasMany('Telescope')
    }
})

//USER RELATIONSHIPS
const User = bookshelf.model('User', {
    tableName: 'users',
    userdetails(){
        return this.belongsTo('UserDetails')
    },
    carts(){
        return this.hasOne('Cart')
    }
})
const UserDetails = bookshelf.model('UserDetails', {
    tableName: 'userDetails',
    user() {
        return this.hasOne('User')
    }
})

//ORDERS RELATIONSHIPS
const Order = bookshelf.model('Order', {
    tableName:'orders',
    status(){
        return this.belongsTo('Status')
    },
    Shipping(){
        return this.belongsTo('Shipping')
    },
    carts(){
        return this.hasOne('Cart')
    }
})
const Status = bookshelf.model('Status', {
    tableName:'status',
    orders(){
        return this.hasOne('Order')
    }
})
const Shipping = bookshelf.model('Shipping', {
    tableName:'shipping',
    orders(){
        return this.hasOne('Order')     
    }
})

//CART RELATIONSHIPS
const Cart = bookshelf.model('Cart', {
    tableName: 'cart',
    user(){
        return this.belongsTo('User')
    },
    orders(){
        return this.belongsTo('Order')
    }
})

module.exports = {Telescope, Category, Brand, User, UserDetails, Order, Status, Shipping, Cart}
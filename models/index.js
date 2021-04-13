const bookshelf = require('../bookshelf')

//TELESCOPES RELATIONSHIPS
const Telescope = bookshelf.model('Telescope', {
    tableName:'telescopes',
    category(){
        return this.belongsTo('Category')
    },
    brand(){
        return this.belongsTo('Brand')
    },
    carts(){
        return this.hasMany('Cart')
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
    tableName: 'users'
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
        return this.hasMany('Order')
    }
})
const Shipping = bookshelf.model('Shipping', {
    tableName:'shipping',
    orders(){
        return this.hasMany('Order')     
    }
})

//CART RELATIONSHIPS
const Cart = bookshelf.model('Cart', {
    tableName: 'cart',
    user(){
        return this.belongsTo('User')
    },
    telescope(){
        return this.belongsTo('Telescope')
    },
    orders(){
        return this.belongsTo('Order')
    }
    
})

module.exports = {Telescope, Category, Brand, User, Order, Status, Shipping, Cart}
const bookshelf = require('../bookshelf')

//TELESCOPES RELATIONSHIPS
const Telescope = bookshelf.model('Telescope', {
    tableName: 'telescopes',
    category() {
        return this.belongsTo('Category')
    },
    brand() {
        return this.belongsTo('Brand')
    },
    carts() {
        return this.hasMany('Cart')
    }

})
const Category = bookshelf.model('Category', {
    tableName: 'categories',
    telescope() {
        return this.hasMany('Telescope')
    }
})
const Brand = bookshelf.model('Brand', {
    tableName: 'brands',
    telescope() {
        return this.hasMany('Telescope')
    }
})

//USER RELATIONSHIPS
const User = bookshelf.model('User', {
    tableName: 'users'
})

//ORDERS RELATIONSHIPS
const Order = bookshelf.model('Order', {
    tableName: 'orders',
    status() {
        return this.belongsTo('Status')
    },
    shipping() {
        return this.belongsTo('Shipping')
    },
    users() {
        return this.belongsTo('User')
    }
})
const Status = bookshelf.model('Status', {
    tableName: 'status',
    orders() {
        return this.hasMany('Order')
    }
})
const Shipping = bookshelf.model('Shipping', {
    tableName: 'shipping',
    orders() {
        return this.hasMany('Order')
    }
})

//CART RELATIONSHIPS
const Cart = bookshelf.model('Cart', {
    tableName: 'cart',
    user() {
        return this.belongsTo('User')
    },
    telescope() {
        return this.belongsTo('Telescope')
    },
    orders() {
        return this.hasOne('Order')
    }

})

//BLACKLIST
const BlacklistedToken = bookshelf.model('BlacklistedToken', {
    tableName: 'blacklisted_token'
})

//CART CONFIRM DUPE
const CartConfirm = bookshelf.model('CartOrder', {
    tableName: 'cartConfirm',
    user() {
        return this.belongsTo('User')
    },
    telescope() {
        return this.belongsTo('Telescope')
    },
    orders() {
        return this.hasOne('Order')
    }


})
module.exports = { Telescope, Category, Brand, User, Order, Status, Shipping, Cart, BlacklistedToken, CartConfirm }
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
    tableName: 'users'
})


module.exports = {Telescope, Category, Brand, User}
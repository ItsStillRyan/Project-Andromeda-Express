const bookshelf = require('../bookshelf')

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



module.exports = {Telescope, Category, Brand}
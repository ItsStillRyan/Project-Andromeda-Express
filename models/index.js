const bookshelf = require('../bookshelf')

const Telescope = bookshelf.model('Telescope', {
    tableName:'telescopes',
    category(){
        return this.belongsTo('Category')
    }
})

const Category = bookshelf.model('Category',{
    tableName: 'categories',
    telescope(){
        return this.hasMany('Telescope')
    }
})

const Brand = bookshelf.model('Brand',{
    tableName: 'brands',
    brand(){
        return this.hasMane('Telescope')
    }
})

module.exports = {Telescope, Category, Brand}
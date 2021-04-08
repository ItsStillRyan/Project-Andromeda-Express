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

module.exports = {Telescope, Category}
const bookshelf = require('../bookshelf')

const Telescope = bookshelf.model('Telescope', {
    tableName:'telescopes'
})

module.exports = {Telescope}
const { Telescope, Category, Brand } = require("../models")

const getAllCate = async () => {
    return await Category.fetchAll().map((category) => {
        return [category.get('id'), category.get('name')]
    })
}

const getAllBrands = async () => {
    return await Brand.fetchAll().map((brand) => {
        return [brand.get('id'), brand.get('name')]
    })
}

const getTeleId = async (telescope_id) => {
    return await Telescope.where({
        'id': parseInt(telescope_id)
    }).fetch({
        require: true,
        withRelated: ['category', 'brand']
    })
}

const getAllTelescope = async () => {
    return await Telescope.fetchAll()
}

module.exports = {
    getAllCate, getAllBrands, getTeleId, getAllTelescope
}
const { Telescope, Category, Brand } = require("../models")

const getAllCate = async () => {
    const allCate = await Category.fetchAll().map((category) => {
        return [category.get('id'), category.get('name')]
    })
}

const getAllBrands = async () => {
    const allBrands = await Brand.fetchAll().map((brand) => {
        return [brand.get('id'), brand.get('name')]
    })
}

const getTeleId = async () => {
    const telescope = await Telescope.where({
        'id': req.params.telescope_id
    }).fetch({
        require: true
    })
}

module.exports = {
    getAllCate, getAllBrands, getTeleId
}
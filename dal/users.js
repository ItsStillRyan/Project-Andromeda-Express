const {User} = require('../models')

const getUser = async (userid) => {
    return await User.where({
        'id': userid
    }).fetch({
        require: false
    })
}

module.exports = {
    getUser
}
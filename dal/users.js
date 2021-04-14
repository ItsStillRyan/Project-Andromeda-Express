const {User} = require('../models')

const getUser = async (userId) => {
    const a = await User.where({
        'id': parseInt(userId)
    }).fetch({
        require:true
    })
    
    return a
}

module.exports = {
    getUser
}
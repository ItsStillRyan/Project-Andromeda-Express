const { User } = require('../models')
const uDal = require('../dal/cart')

class UserService{
    constructor(user_id) {
        this.users_id = user_id
    }

    async getUser(){
        const userPersonal = await uDal.getUser(this.user_id)
        return userPersonal
    }

}

module.exports = UserService
const { User } = require('../models')
const {uDal} = require('../dal/users')

class UserService {
    constructor(user_id) {
        this.users_id = user_id
    }

    async getUser(){
        const profile = await uDal.getUser(this.users_id);
        return profile;
    }
}

module.exports = {UserService}
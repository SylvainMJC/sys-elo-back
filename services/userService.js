const bcrypt = require('bcrypt');
const User = require('../models/user');


class UserService {
    
    constructor(UserModel) {
        this.User = UserModel;
    }

    async getAllUsers() {
        console.log('hereService')
        return this.User.findAll();
    }

    async getUserById(id) {
        console.log('Fetching all users from the database');
        if (!id) {
            return null;
        }
        return this.User.findByPk(id);
    }


    async createUser(data) {
        const existingUser = await this.User.findOne({ where: { email: data.email } });
        if (existingUser) {
            throw new Error('Email is already in use');
        }

        const hashedPassword = await bcrypt.hash(data.password, 10); 
        const userData = {
            ...data,
            password: hashedPassword, 
        };

        return this.User.create(userData);
    }

    async updateUser(id, data) {
        const user = await this.User.findByPk(id);
        if (!user) {
            return null;
        }
        return user.update(data);
    }

    async deleteUser(id) {
        const user = await this.User.findByPk(id);
        if (!user) {
            return null;
        }
        return user.destroy();
    }
}

module.exports = UserService;

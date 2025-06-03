const bcrypt = require("bcrypt");
const User = require("../models/user");

class UserService {
  constructor(UserModel) {
    this.User = UserModel;
  }

  async getAllUsers() {
    return this.User.findAll();
  }

  async getUserById(id) {
    try {
      return await this.User.findByPk(id);
    } catch (error) {
      throw new Error(`Erreur lors de la récupération de l'utilisateur: ${error.message}`);
    }
  }

  async createUser(data) {
    const existingUser = await this.User.findOne({
      where: { email: data.email },
    });
    if (existingUser) {
      throw new Error("Email is already in use");
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

  async updateUserElo(userId, newElo) {
    try {
      const user = await this.User.findByPk(userId);
      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }
      
      user.elo = newElo;
      user.updated_at = new Date();
      await user.save();
      
      return user;
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour de l'ELO: ${error.message}`);
    }
  }

  async getTopPlayers(limit = 10) {
    try {
      return await this.User.findAll({
        order: [['elo', 'DESC']],
        limit: limit,
        attributes: ['id', 'username', 'elo']
      });
    } catch (error) {
      throw new Error(`Erreur lors de la récupération du classement: ${error.message}`);
    }
  }
}

module.exports = UserService;

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


class Login {
    constructor(userModel) {
        this.userModel = userModel;
    }

    async authenticateUser(email, password) {
        const user = await this.userModel.findOne({ where: { email } });

        if (!user) {
            throw new Error('Utilisateur non trouvé');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            throw new Error('Mot de passe incorrect');
        }

        // token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        return token;
    }
}

module.exports = Login;
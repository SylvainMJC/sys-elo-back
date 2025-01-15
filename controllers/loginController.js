const LoginService = require('../services/loginService');

class LoginController {
    constructor(LoginService) {
        this.loginService = LoginService;
    }

    async loginUser(req, res) {
        const { email, password } = req.body;

        try {
            const { token, user } = await this.loginService.loginUser(email, password);
            res.json({ token, user });
        } catch (error) {
            res.status(401).json({ message: error.message });
        }
    }

    async registerUser(req, res) {
        const { username,email, password } = req.body;

        try {
            const user = await this.loginService.registerUser(username, email, password);
            res.json(user);
        } catch (error) {
            res.status(401).json({ message: error.message });
        }
    }

    async logoutUser(req, res) {
        res.json({ message: 'Vous êtes déconnecté' });
    }

}

module.exports = LoginController;

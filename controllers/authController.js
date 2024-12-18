const jwt = require('jsonwebtoken');
const { User } = require('../models'); // Correction de l'importation du modèle User
const bcrypt = require('bcrypt');

// Fonction pour générer un token JWT
const generateToken = (user) => {
    return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

// Fonction pour se connecter
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Email:', email); // Ajout de log pour vérifier l'email

        const user = await User.findOne({ where: { email } });
        console.log('User found:', user); // Ajout de log pour vérifier l'utilisateur trouvé

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).send({ error: 'Invalid email or password' });
        }

        const token = generateToken(user);
        res.status(200).send({ token });
    } catch (error) {
        console.error('Error:', error); // Ajout de log pour mieux comprendre l'erreur
        res.status(500).send({ error: 'Internal Server Error' });
    }
};

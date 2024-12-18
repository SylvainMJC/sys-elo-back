// const bcrypt = require('bcrypt');
// const { User } = require('../models');

// // Créer un nouvel utilisateur
// exports.createUser = async (req, res) => {
//     try {
//         const { name, email, password, role_id } = req.body;

//         // Vérifier si l'utilisateur existe déjà
//         const existingUser = await User.findOne({ where: { email } });
//         if (existingUser) {
//             return res.status(400).json({ message: 'Email is already in use' });
//         }

//         const existingName = await User.findOne({ where: { name } });
//         if (existingName) {
//             return res.status(400).json({ message: 'Name is already in use' });
//         }

//         // Hacher le mot de passe
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Créer l'utilisateur
//         const newUser = await User.create({
//             name,
//             email,
//             password: hashedPassword,
//             role_id,
//         });

//         res.status(201).json({
//             message: 'User created successfully',
//             user: newUser,
//         });
//     } catch (error) {
//         console.error('Error creating user:', error);
//         res.status(500).json({ error: error.message });
//     }
// };

// // Obtenir tous les utilisateurs
// exports.getAllUsers = async (req, res) => {
//     try {
//         const users = await User.findAll();
//         res.status(200).json(users);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// // Obtenir un utilisateur par ID
// exports.getUserById = async (req, res) => {
//     try {
//         const user = await User.findByPk(req.params.id);
//         if (user) {
//             res.status(200).json(user);
//         } else {
//             res.status(404).json({ error: 'User not found' });
//         }
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// // Mettre à jour un utilisateur
// exports.updateUser = async (req, res) => {
//     try {
//         const { password } = req.body;

//         // Si un nouveau mot de passe est fourni, le hacher
//         if (password) {
//             req.body.password = await bcrypt.hash(password, 10);
//         }

//         const [updated] = await User.update(req.body, {
//             where: { id: req.params.id },
//         });

//         if (updated) {
//             const updatedUser = await User.findByPk(req.params.id);
//             res.status(200).json(updatedUser);
//         } else {
//             res.status(404).json({ error: 'User not found' });
//         }
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// // Supprimer un utilisateur
// exports.deleteUser = async (req, res) => {
//     try {
//         const deleted = await User.destroy({
//             where: { id: req.params.id },
//         });

//         if (deleted) {
//             res.status(204).send();
//         } else {
//             res.status(404).json({ error: 'User not found' });
//         }
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };


const { User } = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Fonction pour générer un token JWT
const generateToken = (user) => {
    return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

// Créer un nouvel utilisateur
exports.createUser = async (req, res) => {
    const { name, password, email, role_id } = req.body;

    try {
        // Validation de l'email
        const validMail = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
        if (!validMail.test(email)) {
            return res.status(400).json({ message: "Please enter a valid email address" });
        }

        // Vérification de l'unicité de l'email
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already in use" });
        }

        // Hachage du mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Création de l'utilisateur
        const newUser = await User.create({ name, password: hashedPassword, email, role_id });

        // Génération du token
        const token = generateToken(newUser);

        // Renvoyer le token dans la réponse
        res.status(201).json({ message: "User created successfully", token });
    } catch (error) {
        console.error(error.message);
        res.status(400).json({ error: error.message });
    }
};

// Obtenir tous les utilisateurs
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtenir un utilisateur par ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Mettre à jour un utilisateur
exports.updateUser = async (req, res) => {
    try {
        const [updated] = await User.update(req.body, {
            where: { id: req.params.id }
        });
        if (updated) {
            const updatedUser = await User.findByPk(req.params.id);
            res.status(200).json(updatedUser);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
    try {
        const deleted = await User.destroy({
            where: { id: req.params.id }
        });
        if (deleted) {
            res.status(204).send('User deleted');
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

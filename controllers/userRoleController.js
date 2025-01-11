class UserRoleController {
    constructor(userRoleService) {
        this.UserRole = userRoleService;
    }

    async getAllUserRoles(req, res) {
        try {
            const userRoles = await this.UserRole.getAllUserRoles();
            res.status(200).json(userRoles);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch userRoles' });
        }
    }

    async getUserRolesById(req, res) {
        try {
            const userRole = await this.UserRole.getUserRolesById(req.params.id);
            if (!userRole) {
                return res.status(404).json({ error: 'UserRole not found' });
            }
            res.status(200).json(userRole);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch userRole' });
        }
    }

    async createUserRole(req, res) {
        try {
            const newUserRole = await this.UserRole.createUserRole(req.body);
            res.status(201).json(newUserRole);
        } catch (error) {
            res.status(500).json({ error:  error.message });
        }
    }

    async updateUserRole(req, res) {
        try {
            const updatedUserRole = await this.UserRole.updateUserRole(req.params.id, req.body);
            res.status(200).json(updatedUserRole);
        } catch (error) {
            res.status(500).json({ error:  error.message });
        }
    }

    async deleteUserRole(req, res) {
        try {
            const deleteUserRole = await this.UserRole.deleteUserRole(req.params.id, req.body);
            res.status(200).json(deleteUserRole);
        } catch (error) {
            res.status(500).json({ error:  error.message });
        }
    }
}

module.exports = UserRoleController;    



// const { UserRole } = require('../models/userRole');

// // Créer une nouvelle relation utilisateur-rôle
// exports.createUserRole = async (req, res) => {
//     try {
//         const userRole = await UserRole.create(req.body);
//         res.status(201).json(userRole);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };

// // Obtenir toutes les relations utilisateur-rôle
// exports.getAllUserRoles = async (req, res) => {
//     try {
//         const userRoles = await UserRole.findAll();
//         res.status(200).json(userRoles);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };

// // Obtenir une relation utilisateur-rôle par ID
// exports.getUserRoleById = async (req, res) => {
//     try {
//         const userRole = await UserRole.findByPk(req.params.id);
//         if (userRole) {
//             res.status(200).json(userRole);
//         } else {
//             res.status(404).json({ error: 'UserRole not found' });
//         }
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };

// // Mettre à jour une relation utilisateur-rôle
// exports.updateUserRole = async (req, res) => {
//     try {
//         const [updated] = await UserRole.update(req.body, {
//             where: { id: req.params.id }
//         });
//         if (updated) {
//             const updatedUserRole = await UserRole.findByPk(req.params.id);
//             res.status(200).json(updatedUserRole);
//         } else {
//             res.status(404).json({ error: 'UserRole not found' });
//         }
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };

// // Supprimer une relation utilisateur-rôle
// exports.deleteUserRole = async (req, res) => {
//     try {
//         const deleted = await UserRole.destroy({
//             where: { id: req.params.id }
//         });
//         if (deleted) {
//             res.status(204).send('UserRole deleted');
//         } else {
//             res.status(404).json({ error: 'UserRole not found' });
//         }
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };

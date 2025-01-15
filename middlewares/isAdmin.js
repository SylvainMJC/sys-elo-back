const  UserRole  = require('../models/userRole');
const { Role } = require('../models/role');

const isAdmin = async (req, res, next) => {
    try {
        const userRole = await UserRole.findOne({
            where: { id_user: req.user.id },
            include: [Role]
        });

        if (!userRole || userRole.Role.name !== 'admin') {
            return res.status(403).send({ error: 'You do not have admin rights.' });
        }

        next();
    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
};

module.exports = isAdmin;

// const jwt = require('jsonwebtoken');
// const { User } = require('../models/user');

// const auth = async (req, res, next) => {
//     try {
//         const token = req.header('Authorization').replace('Bearer ', '');
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const user = await User.findByPk(decoded.id);

//         if (!user) {
//             throw new Error();
//         }

//         req.user = user;
//         req.token = token;
//         next();
//     } catch (error) {
//         res.status(401).send({ error: 'The token is missing, add it to the header' });
//     }
// };

// module.exports = auth;

const jwt = require('jsonwebtoken');
const { User } = require('../models/user');

// Middleware d'authentification
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).send({ error: 'The token is missing, add it to the header' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id);

        if (!user) {
            return res.status(401).send({ error: 'User not found' });
        }

        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).send({ error: 'Invalid token' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).send({ error: 'Token expired' });
        }
        res.status(500).send({ error: 'Internal Server Error' });
    }
};

module.exports = auth;


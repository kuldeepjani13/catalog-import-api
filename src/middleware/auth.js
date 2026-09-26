require('dotenv').config();

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const MarchentAccounts = require('../models/MerchantAccounts');
const { AppError } = require('./appError');

const auth = (...allowedRoles) => {
    return async(req, res, next) => {
        try {
            const headers = req.headers.authorization;

            if(!headers || !headers.startsWith('Bearer ') || !headers.split(' ')[1]) {
                return next(new AppError('Missing or Invalid authentication1', 'INVALID', 401));
            }
            const token = headers.split(' ')[1];
            const payload = jwt.verify(token, JWT_SECRET);
            const hasRoleAccess = allowedRoles.includes('all') || allowedRoles.includes(payload.role);
            
            if(!payload || !payload.role || !hasRoleAccess) {
                return next(new AppError('Missing or Invalid authentication2', 'INVALID', 401));
            }

            const marchentAccExists = await MarchentAccounts.findById(payload.sub);

            if(!marchentAccExists) {
                return next(new AppError('Missing or Invalid authentication3', 'INVALID', 401));
            }
            
            req.user = payload;
            next();
        } catch(err) {
            next(err);
        }
    }
}

module.exports = auth;
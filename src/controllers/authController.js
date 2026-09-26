require('dotenv').config();
const MerchantAccounts = require('../models/MerchantAccounts');
const bcrypt = require('bcrypt');
const { AppError } = require('../middleware/appError');
const SALT_ROUNDS = process.env.SALT_ROUNDS
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
const jwt = require('jsonwebtoken');

const register = async (req, res, next) => {
    try {
        const { companyName, contactEmail, password, role } = req.body;

        if(!role || role == 'admin') {
            return next(new AppError('Unauthorized', 'FORBIDDEN', 403));
        }

        const existingMerchent = await MerchantAccounts.findOne({ contactEmail });
        if (existingMerchent) {
            return next(new AppError('Merchent Already Exits', 'CONFLICT', 409));
        }

        const hashPassword = await bcrypt.hash(password, (Number)(SALT_ROUNDS));

        const newMerchent = {
        companyName: companyName,
        contactEmail: contactEmail,
        password: hashPassword,
        role: 'merchant'
        };

        const createdMerchant = await MerchantAccounts.create(newMerchent);

        res.status(201).json({
            message: 'Created',
            details: {
                'companyName' : createdMerchant.companyName,
                'contactEmail' : createdMerchant.contactEmail,
                'role': createdMerchant.role 
            }
        });
    } catch (err) {
        next(err)
    }
};


const login = async (req, res, next) => {
    try {
        const { contactEmail, password } = req.body;

        if (!contactEmail || !password) {
            return next(new AppError('Unauthenticated', 'UNAUTHORIZED', 401));
        }

        const merchantAcc = await MerchantAccounts.findOne({ contactEmail });
        if (!merchantAcc) {
            return next(new AppError('Unauthenticated', 'UNAUTHORIZED', 401));
        }

        const isMatch = await bcrypt.compare(password, merchantAcc.password);
        if (!isMatch) {
            return next(new AppError('Unauthenticated', 'UNAUTHORIZED', 401));
        }

        const token = jwt.sign(
            { sub: merchantAcc._id, role: merchantAcc.role },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: JWT_EXPIRES_IN }
        );

        return res.status(200).json({
            message: "Login successful",
            token
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { register, login };

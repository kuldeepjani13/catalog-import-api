const { body, validationResult } = require('express-validator');
const { AppError } = require('./appError');

const validation = (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors)
    if(!errors.isEmpty()) {
        return next(new AppError('Validation Failed', 'VALIDATION_FAILED', 400, errors.array().map(err => err.msg)));
    }
    next();
}

const registraionValidation = [
    body('companyName')
    .trim()
    .notEmpty().withMessage('Company Name is Required'),
    body('contactEmail')
    .trim()
    .notEmpty().withMessage('Contact Email is Required')
    .isEmail().withMessage('Email must be in valid format'),
    body('password')
    .trim()
    .notEmpty().withMessage('Password is Required')
    .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minSymbols: 1
    }).withMessage('Password must contain at least 8 characters, and have lowercase, uppercase and symbol'),
    body('role')
    .trim()
    .notEmpty().withMessage('Role is Required')
    .isIn(['merchant', 'admin']).withMessage('Role must be from in - merchant or admin'),
    validation
];

const loginValidation = [
    body('contactEmail')
    .trim()
    .notEmpty().withMessage('Contact Email is Required')
    .isEmail().withMessage('Email must be in valid format'),
    body('password')
    .trim()
    .notEmpty().withMessage('Password is Required')
    .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minSymbols: 1
    }).withMessage('Password must contain at least 8 characters, and have lowercase, uppercase and symbol'),
    validation
];

const createImportValidation = [
    body('catalogName')
    .notEmpty().withMessage('Catalog Name is Required')
];


module.exports = { 
    registraionValidation, 
    loginValidation, 
    createImportValidation,
}
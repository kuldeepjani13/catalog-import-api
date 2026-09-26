require('dotenv').config();
const mongoose = require('mongoose');
const bcyrpt = require('bcrypt');
const MerchantAccounts = require('../models/MerchantAccounts');

const MONGO_URI = process.env.MONGO_URI;
const ADMIN_NAME = process.env.ADMIN_NAME;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const SALT_ROUNDS = process.env.SALT_ROUNDS;

const createAdmin = async() => {
    try {
        await mongoose.connect(MONGO_URI);

        const adminExists = await MerchantAccounts.findOne({role: 'admin'});
        if(adminExists) {
            console.log({'Message': 'We have at least one Admin in System'});
        } else {
            const adminHashPass = await bcyrpt.hash(ADMIN_PASSWORD, (Number)(SALT_ROUNDS));
            const addAdminObj = {
                companyName: ADMIN_NAME,
                contactEmail: ADMIN_EMAIL,
                password: adminHashPass,
                role: 'admin'
            }

            const createdAdmin = await MerchantAccounts.create(addAdminObj);
            console.log({
                'Message': 'Admin Created Successfully',
                'Data': {
                    'name': createdAdmin.companyName,
                    'email': createdAdmin.contactEmail,
                    'password': createdAdmin.password
                }
            });
        }
    } catch(err) {
        throw(err);
    }
}

createAdmin();
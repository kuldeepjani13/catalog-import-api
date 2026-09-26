const mongoose = require('mongoose');

const marchantAccountsSchema = mongoose.Schema(
    {
        'companyName': {
            type: String,
            required: [true, 'Company Name is Required'],
            maxlength: [150, 'Company Name should not have more than 150 characters']
        },
        'contactEmail': {
            type: String,
            required: [true, 'Contact Email is Required'],
            unique: true,
            maxlength: [255, 'Contact Email should not have more than 255 characters']
        },
        'password': {
            type: String,
            required: [true, 'Password Hash is Required'],
            maxlength: [255, 'Password Hash should not have more than 255 characters']
        },
        'role': {
            type: String,
            required: [true, 'Role is Required'],
            enum: ['merchant', 'admin'],
            default: 'merchant'
        }
    },
    {
        timestamps: {
            createdAt: 'created_at',
            upadatedAt: 'updated_at'
        },
    }
);

const MarchentAccounts = mongoose.model('MarchentAccounts', marchantAccountsSchema);
module.exports = MarchentAccounts;

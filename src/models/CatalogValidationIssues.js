const mongoose = require('mongoose');

const catalogValidationIssuesSchema = mongoose.Schema(
    {
        'importId': {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'CatalogImports'
        },
        'rowNumber': {
            type: Number,
            required: [true, 'Row Number is Required'],
        },
        'columnName': {
            type: String,
            required: [true, 'Column Name is Required'],
            maxlength: [100, 'Column Name should not have more than 100 characters']
        },
        'issueCode': {
            type: String,
            required: [true, 'Issue Code is Required'],
            maxlength: [100, 'Issue Code should not have more than 100 characters']
        },
        'message': {
            type: String,
            required: [true, 'Message is Required'],
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
        },
    }
);

const catalogValidationIssues = mongoose.model('catalogValidationIssues', catalogValidationIssuesSchema);
module.exports = catalogValidationIssues;

const mongoose = require('mongoose');

const catalogImportsSchema = mongoose.Schema(
    {
        'accountId': {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MarchentAccounts'
        },
        'catalogName': {
            type: String,
            required: [true, 'Catalog Name is Required'],
            unique: true,
            maxlength: [255, 'Catalog Name should not have more than 255 characters']
        },
        'sourceFormat': {
            type: String,
            maxlength: [20, 'Source Format should not have more than 255 characters'],
            default: null
        },
        'status': {
            type: String,
            enum: ['uploaded', 'validating', 'accepted', 'rejected'],
            default: null
        },
        'sourceFile': {
            type: [String],
            maxlength: [500, 'Source File should not have more than 500 characters'],
            default: null
        },
        'totalRows': {
            type: Number,
            required: [true, 'Total Rows Required'],
            default: 0
        },
        'validRows': {
            type: Number,
            required: [true, 'Valid Rows Required'],
            default: 0
        },
        'invalidRows': {
            type: Number,
            required: [true, 'Invalid Rows Required'],
            default: 0
        },
        'startedAt': {
            type: Date,
            default: null
        },
        'completedAt': {
            type: Date,
            default: null
        }
    },
    {
        timestamps: {
            createdAt: 'created_at',
            upadatedAt: 'updated_at'
        },
    }
);

const CatalogImports = mongoose.model('CatalogImports', catalogImportsSchema);
module.exports = CatalogImports;

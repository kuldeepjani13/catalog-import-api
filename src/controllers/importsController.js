require('dotenv').config();
const CatalogImports = require('../models/CatalogImports');
const { AppError } = require('../middleware/appError');
const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');
const fs = require('fs');
const csv = require('csv-parse');
const path = require('path');

const createImport = async (req, res, next) => {
    try {
        const { catalogName, sourceFormat} = req.body;

        const existingCatalog = await CatalogImports.findOne({ catalogName });

        if(existingCatalog !== null) {
            return next(new AppError('Same catalog name already exists', 'CONFLICT', 409));
        }

        if(catalogName.length == 0) {
            return next(new AppError("Catalog Name Required", "BAD_REQUEST", 400));
        }
        if(req.files.length == 0) {
            return next(new AppError("Csv file is required", "BAD_REQUEST", 400));
        }

        const fileNameArr = req.files.map(file => file.filename);
        const headers = req.headers.authorization;
        const token = headers.split(' ')[1];
        const payload = jwt.verify(token, JWT_SECRET);

        const catalogImport = await CatalogImports.create({
            accountId: payload.sub,
            catalogName,
            sourceFormat,
            sourceFile: fileNameArr,
            totalRows: 0,
            validRows: 0,
            invalidRows: 0,
            status: "uploaded",
        });

        return res.status(201).json({
            success: true,
            message: "Import created successfully",
            data: catalogImport,
        })
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const getCatalog = async(req, res, next) => {
    try {
        const page = req.query?.page || 1;
        const limit = req.query?.pageSize || 25;
        const skip = (page - 1) * limit;

        const filter = {};
        const sortData = {};
        const {status, sort, order} = req.query; 

        const MerchentId = req.user.id;

        if(status) {
            filter.status = status;
        }
        if(sort) {
            sortData[sort] = Number((!order || order == 'desc') ? -1 : 1);
        }

        if(req.user.role == 'merchent') {
            filter.accountId = MerchentId;
        }

        const importsData = await CatalogImports.find(filter).skip(skip).limit(limit).sort(sortData);

        const totalDocuments = await CatalogImports.countDocuments(filter);

        return res.status(200).json({
            success: true,
            data: importsData,
            pagination: {
                page: page,
                pageSize: limit,
                total: Math.ceil(totalDocuments / limit),
            }
        });
    } catch(err) {
        next(err);
    }
}

const getCatalogById = async(req, res, next) => {
    try {
        const { id } = req.params;

        const merchentId = req.user.id;
        const filter = {};

        if(req.user.role == 'user') {
            filter.accountId = merchentId
        } 
        if(id) {
            filter._id = id;
        }

        const importCatalogList = await CatalogImports.find(filter);
        if(!CatalogImports || CatalogImports.length == 0) {
            return next(new AppError("Resource not found", 'RESOURCE_NOT_FOUND', 409));
        }

        return res.status(200).json({
            success: true,
            data: importCatalogList
        });

    } catch(err) {
        next(err);
    }
}

const getValidateCatalog = async(req, res, next) => {
    try {
        const { id } = req.params;
        const merchentId = req.user ? req.user.id : null;

        const importDoc = await CatalogImports.findById(id);
        if(!importDoc) {
            return next(new AppError('Record not found', 'RECORD_NOT_FOUND', 404));
        }

        if(merchentId && importDoc.accountId && merchentId.toString() === importDoc.accountId.toString()) {
            return next(new AppError('Access denied', 'ACCESS_DENIED', 403));
        }

        if(importDoc.status === 'validatin' || importDoc.status === 'accepted') {
            return next(new AppError(`Import can not be validated from status ${importDoc.status}`));
        }
        importDoc.status = 'validating';
        await importDoc.save();


        const files = importDoc.sourceFile
        for (const file of files) {
            const filePath = path.join(__dirname, '../storage', file); 

            if(!fs.existsSync(filePath)) {
                return next(new AppError('Source file does not exists', 'RESOURCE_NOT_FOUND', 400));
            }
            console.log(filePath)
            const parser = fs.createReadStream(filePath).pipe(
                parse({
                    columns: true,
                    skip_empty_lines: true,
                    trim: true 
                })
            );
            console.log(parser)
        }
    } catch(err) {
        next(err);
    }
}







module.exports = { createImport, getCatalog, getCatalogById, getValidateCatalog }
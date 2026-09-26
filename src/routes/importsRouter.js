const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const  { createImportValidation } = require('../middleware/validation');
 
const { createImport, getCatalog, getCatalogById, getValidateCatalog } = require('../controllers/importsController');

router.post('/', auth('all'), createImportValidation, upload.array('sourceFile', 5), createImport);
router.get('/', auth('all'), getCatalog);
router.get('/:id', auth('all'), getCatalogById);
router.get('/:id/validate', auth('all'), getValidateCatalog);


module.exports = router;
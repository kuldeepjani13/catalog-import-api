const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(process.cwd(), "../storage");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// const uploadDir = path.join(process.cwd(), "../storage");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, ext); 

        const uniqueName = baseName + '-' + Date.now() + ext;
        cb(null, uniqueName);
    }
});

const fileFilter = (req, files, cb) => {

    if(files.mimetype !== 'text/csv'){
        return cb(new Error("Only CSV files are allowed"));
    }
    cb(null, true);
}

const upload = multer({
    storage,
    limit: {
        fileSize: 10 * 1024 * 1024, //10MB 
    },
    fileFilter
});

module.exports = upload;
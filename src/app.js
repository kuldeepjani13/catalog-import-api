const express = require('express');
const app = express();
const { AppError, errorHandler } = require('./middleware/appError');
const multer = require('multer');
const authRouter = require('./routes/authRouter');
const importsRouter = require('./routes/importsRouter');
const upload = multer({ dest: 'uploads/' });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth/', authRouter);
app.use('/api/imports/', importsRouter);
app.use(errorHandler);

module.exports = app;
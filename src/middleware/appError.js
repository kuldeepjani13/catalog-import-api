class AppError extends Error {
    constructor(message, errCode, statusCode, errorDetails) {
        super(message);
        this.errCode = errCode;
        this.statusCode = statusCode;
        this.success = statusCode >= 200 || statusCode < 300 ? true : false;
        this.errorDetails = errorDetails;
        Error.captureStackTrace(this, this.constructor);
    }
}

const errorHandler = (err, req, res, next) => {
    err.errCode = err.errCode || 'INVALID_REQUEST';
    err.statusCode = err.statusCode || 500;
    err.success = err.success || false;
    err.errorDetails = err.message || [];

    res.status(err.statusCode).json({
        success: err.success,
        error: {
            statusCode: err.statusCode,
            details: err.errorDetails,
        }
    });
}

module.exports = { AppError, errorHandler };
require('dotenv').config();

const mongoose = require('mongoose');
const MONGO_URI = process.env.MONGO_URI;

const dbConnection = async() => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log(`Database connected successfully`);
    } catch(err) {
        console.log(`Database connection failed: ${err.message}`);
        throw(err);
    }
}

module.exports = dbConnection;
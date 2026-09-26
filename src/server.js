require('dotenv').config();
const dbConnection = require('./config/database');
const app = require('./app');
const PORT = process.env.PORT;

const startServer = async() => {
    try {
        await dbConnection();
        app.listen(PORT, () => {
            console.log(`Server started on ${PORT}`);
        });
    } catch(err) {
        throw(err);
    }
}

startServer();
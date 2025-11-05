import express from 'express';
import User from './models/User.js';
import sequelize from './config/database.js';
const app = express();
const PORT = process.env.PORT || 5000;
async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
        const user = await User.create({
            name: "Test",
            email: "test@gmail.com",
            password: "password123",
            phone: "1234567890",
            role: "USER"
        });
        console.log('User created:', user.toJSON());
    }
    catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}
app.get('/', (req, res) => {
    res.send('Server is running...!');
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map
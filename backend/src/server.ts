import "./config/env.js";
import dotenv from 'dotenv';
import { exec } from 'child_process';
import { promisify } from 'util';
import app from './app.js';
import sequelize from './config/database.js';
import defineAssociations from './config/associations.js';

dotenv.config();

const execPromise = promisify(exec);
const PORT = process.env.PORT || 5000;

const runMigrations = async () => {
    try {
        console.log('🔄 Running pending migrations...');
        const env = process.env.NODE_ENV || 'development';
        const { stdout, stderr } = await execPromise(`npx sequelize-cli db:migrate --env ${env}`);
        if (stdout) console.log(stdout);
        if (stderr) console.error(stderr);
        console.log('✅ Migrations completed.');
        const { stdout: seedStdout, stderr: seedStderr } = await execPromise(`npx sequelize-cli db:seed:all --env ${env}`);
        if (seedStdout) console.log(seedStdout);
        if (seedStderr) console.error(seedStderr);
        console.log('✅ Seeding completed.');
    } catch (error) {
        console.error('❌ Migration error:', error);
        throw error;
    }
};

const startServer = async () => {
    try {
        defineAssociations(); 
        // Test database connection
        await sequelize.authenticate();
        console.log('✅ Database connection established successfully.');

        // Run migrations before starting server
        await runMigrations();

        // Start listening
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Unable to start server:', error);
        process.exit(1);
    }
};

startServer();
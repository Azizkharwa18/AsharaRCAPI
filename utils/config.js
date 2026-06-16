import dotenv from 'dotenv';
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const config = {
    port: process.env.PORT || 3000,
    db: {
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        name: process.env.MYSQL_DATABASE,
        port: process.env.MYSQL_PORT,
    },
    jwt: {
        secret: process.env.JWT_TOKEN,
        expiresIn: '10d',
    },
};
// Simple validation to ensure critical keys aren't missing
if (!config.port) {
    throw new Error('FATAL ERROR: PORT is not defined.');
}
export default config;
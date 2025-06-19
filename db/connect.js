import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

export const pool =  mysql.createPool({
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    port:process.env.MYSQL_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 100000,
}).promise();

export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Pool connection successful!');
    connection.release();
  } catch (error) {
    console.error('Pool connection failed:', error.message);
  }
}

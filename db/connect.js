import mysql from 'mysql2';
import config from '../utils/config.js'

export const pool = mysql.createPool({
  host: config.db.host,
  database: config.db.name,
  user: config.db.user,
  password: config.db.password,
  port: config.db.port,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 1000,
}).promise();

export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('MySQL Pool connection successful!');
    connection.release();
  } catch (error) {
    console.error('MySQL Pool connection failed:', error.message);
  }
}

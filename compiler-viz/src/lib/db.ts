import mysql from 'mysql2/promise';

let pool: mysql.Pool | null = null;

export function getPool(): mysql.Pool | null {
  if (pool) return pool;

  try {
    pool = mysql.createPool({
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'compiler_viz',
      waitForConnections: true,
      connectionLimit: 10,
    });
    return pool;
  } catch {
    console.warn('MySQL connection not available. History features disabled.');
    return null;
  }
}

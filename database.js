require('dotenv').config();
const { Sequelize } = require('sequelize');

//get DB type from .env file
const dbDialect = process.env.DB_DIALECT || 'sqlite';

let sequelize;
if (dbDialect === 'mysql') {
    // MySQL 설정
    sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT || 3306,
        dialect: 'mysql'
    });
} else if (dbDialect === 'sqlite') {
    // SQLite 설정
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: process.env.SQLITE_STORAGE || './database.db'
    });
} else {
    throw new Error('Unsupported database dialect');
}

module.exports = sequelize;
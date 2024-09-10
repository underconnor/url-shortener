const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Url = sequelize.define('Url', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    originalUrl: { type: DataTypes.TEXT, allowNull: false },
    shortenedUrl: { type: DataTypes.STRING(8), allowNull: false, unique: true },
}, {
    timestamps: true
});

module.exports = Url;
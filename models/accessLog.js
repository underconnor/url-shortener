const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const AccessLog = sequelize.define('AccessLog', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    shortenedUrl: { type: DataTypes.STRING(8), allowNull: false },
    ipAddress: { type: DataTypes.STRING, allowNull: false },
    accessTime: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
    timestamps: false
});

module.exports = AccessLog;
const { DataTypes } = require("sequelize");
const { sequelize } = require("../db");

const ArchivedMessage = sequelize.define(
    "ArchivedMessage",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        message: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        mediaUrl: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        mediaType: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        tableName: "archived_messages",
        timestamps: true,
    }
);

module.exports = ArchivedMessage;
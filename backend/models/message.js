const { DataTypes } = require("sequelize");
const { sequelize } = require("../db");

const Message = sequelize.define(
    "Message",
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
        tableName: "messages",
        timestamps: true,
    }
);

module.exports = Message;
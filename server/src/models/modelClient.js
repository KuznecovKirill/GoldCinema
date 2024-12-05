const { DataTypes } = require('sequelize');
const mysql = require('mysql2');
const sequelize = require("sequelize"); 
const modelExample = require('./model');
const crypto = require('crypto');

const userSchema = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    displayName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        select: false 
    },
    salt: {
        type: DataTypes.STRING,
        allowNull: false,
        select: false 
    }
}, {
    timestamps: true, 
    freezeTableName: true, 
});

// Метод для установки пароля
userSchema.prototype.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString("hex");

    this.password = crypto.pbkdf2Sync(
        password,
        this.salt,
        1000,
        64,
        "sha512"
    ).toString("hex");
};

// Метод для проверки пароля
userSchema.prototype.validPassword = function(password) {
    const hash = crypto.pbkdf2Sync(
        password,
        this.salt,
        1000,
        64,
        "sha512"
    ).toString("hex");

    return this.password === hash;
};

// Экспорт модели
module.exports = userSchema;
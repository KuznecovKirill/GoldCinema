//Модель User, который будет заходить в приложение
const { DataTypes } = require('sequelize');
const sequelize = require("sequelize"); 
const crypto = require('crypto');
const { type } = require('os');

const modelUser = sequelize.define('User', {
    id_user: {
        type: sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
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
modelUser.prototype.setPassword = function(password) {
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
modelUser.prototype.validPassword = function(password) {
    const hash = crypto.pbkdf2Sync(
        password,
        this.salt,
        1000,
        64,
        "sha512"
    ).toString("hex");

    return this.password === hash;
};

modelUser.prototype.toObject = function() {
    const values = { ...this.get() };
    delete values.id; 
    return values;
};

//Преобразование в JSON
modelUser.prototype.toJSON = function() {
    const values = { ...this.get() };
    delete values.id; 
    return values;
};
// Экспорт модели
module.exports = modelUser;
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./database').sequelize;
const crypto = require('crypto');

//Модель пользователя
const modelUser = sequelize.define('User', {
    id_user: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
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
    timestamps: false, 
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
    delete values.id_user; // Исправлено на id_user
    return values;
};

// Преобразование в JSON
modelUser.prototype.toJSON = function() {
    const values = { ...this.get() };
    // delete values.id_user; 
    return values;
};


// (async () => {
//     await modelUser.sync(); // Синхронизация таблицы

//     // Создание нового пользователя
//     const newUser = await modelUser.create({
//         username: "toem",
//         displayName: "Tom",
//         password: "password", // Временный пароль
//         salt: crypto.randomBytes(16).toString("hex") // Генерация соли
//     });

//     // Сохранение пользователя с новым хешированным паролем и солью
//     await newUser.save();

//     console.log('Пользователь создан:', newUser.toJSON());
//     console.log(newUser.toJSON());
// })();

module.exports = { modelUser };
const { DataTypes } = require('sequelize');
const mysql = require('mysql2');
const sequelize = require("sequelize"); 
const modelExample = require('./options');
const crypto = require('crypto');

const modelRewiew = sequelize.define("Rewiew", {
    id_rewiew: {
        type: sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    user: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'User', 
            key: 'id_user'
        }
    },
    content: {
        type: DataTypes.TEXT, // Используется TEXT для хранения длинного текста
        allowNull: false
    },
    mediaType: { //Тип медиа
        type: DataTypes.ENUM('tv', 'movie', 'serial'),
        allowNull: false
    },
    mediaId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    mediaTitle: {
        type: DataTypes.STRING,
        allowNull: false
    },
    mediaPoster: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    timestamps: true, 
    freezeTableName: true, 
}
);

modelRewiew.prototype.toObject = function() {
    const values = { ...this.get() };
    delete values.id_rewiew; 
    return values;
};

//Преобразование в JSON
modelRewiew.prototype.toJSON = function() {
    const values = { ...this.get() };
    delete values.id_rewiew; 
    return values;
};

module.exports = modelRewiew;
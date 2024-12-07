const { DataTypes } = require('sequelize');
const mysql = require('mysql2');
const sequelize = require("sequelize"); 
const modelExample = require('./options');
const crypto = require('crypto');

const modelFavorite = sequelize.define("Favorite",{
    id_favorite: {
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
      mediaType: {
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
    mediaRate: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
});

modelFavorite.prototype.toObject = function() {
    const values = { ...this.get() };
    delete values.id_rewiew; 
    return values;
};

modelFavorite.prototype.toJSON = function() {
    const values = { ...this.get() };
    delete values.id_rewiew; 
    return values;
};

module.exports = {modelFavorite};
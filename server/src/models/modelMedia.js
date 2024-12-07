const { Sequelize, DataTypes } = require('sequelize');
const { modelUser } = require('./modelUser');
const sequelize = require('./database').sequelize;

//Модель пользователя
const modelMedia = sequelize.define('Media', {
    id_media: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    title:{
        type: DataTypes.STRING,
        allowNull: false
    },
    country:{
        type: DataTypes.STRING,
        allowNull: false
    },
    genre:{
        type: DataTypes. STRING,
        allowNull: false
    },
    running_time:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    rars:{
        type: DataTypes.STRING,
        allowNull: false
    },
    rating:{
        type: DataTypes.FLOAT,
        allowNull: false
    },
    descrition:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    poster:{
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false, 
    freezeTableName: true, 
});

modelMedia.prototype.toObject = function() {
    const values = { ...this.get() };
    return values;
};

// Преобразование в JSON
modelMedia.prototype.toJSON = function() {
    const values = { ...this.get() };; 
    return values;
};
(async () => {
    // Синхронизация моделей с базой данных без удаления существующих данных
    await sequelize.sync();
  })();
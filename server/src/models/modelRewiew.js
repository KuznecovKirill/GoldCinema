const { Sequelize, DataTypes } = require('sequelize');
const { modelUser } = require('./modelUser');
const sequelize = require('./database').sequelize;

//Модель пользователя
const modelRewiew = sequelize.define('Rewiew', {
    id_rewiew: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    id_user: {
        type: DataTypes.INTEGER,
        references: {
            model: modelUser,
            key: 'id_user'
        }
    },
    id_media: {
        type: DataTypes.INTEGER,
        // references: {
        //     // model: modelUser,
        //     // key: 'id_user'
        // }
    },
    rating_user:{
        type: DataTypes.FLOAT,
        allowNull: false
    },
    comment_text:{
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    timestamps: false, 
    freezeTableName: true, 
});

modelRewiew.prototype.toObject = function() {
    const values = { ...this.get() };
    return values;
};

// Преобразование в JSON
modelRewiew.prototype.toJSON = function() {
    const values = { ...this.get() };; 
    return values;
};
module.exports =  {modelRewiew};
const { DataTypes } = require('sequelize');
const sequelize = require('sequelize');
const modelExample = sequelize.define('modelExample', {
    // Определение полей для модели
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
});

// Метод для преобразования данных перед отправкой клиенту
MyModel.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    delete values.id; // Удаляем поле id (аналог _id в MongoDB)
    return values;
};

export default modelExample;
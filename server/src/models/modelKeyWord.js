const { DataTypes } = require("sequelize");
const { modelMedia } = require("./modelMedia");
const sequelize = require("./database").sequelize;

//Модель ключевых слов
const modelKeyWord = sequelize.define(
  "KeyWord",
  {
    id_keyWord: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    id_media: {
      type: DataTypes.INTEGER,
      references: {
        model: modelMedia,
        key: "id_media",
      },
    },
    keywords: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);
modelKeyWord.belongsTo(modelMedia, {
  foreignKey: 'id_media',
  targetKey: 'id_media',
  onDelete: 'CASCADE'
});
modelKeyWord.prototype.toObject = function () {
  const values = { ...this.get() };
  return values;
};

// Преобразование в JSON
modelKeyWord.prototype.toJSON = function () {
  const values = { ...this.get() };
  return values;
};
(async () => {
  await sequelize.sync();
})();
module.exports = {  modelKeyWord };
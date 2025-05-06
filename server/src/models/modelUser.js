const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = require("./database").sequelize;
const crypto = require("crypto");
const { modelRole } = require("./modelRole");
const bcrypt = require("bcrypt");

//Модель пользователя
const modelUser = sequelize.define(
  "User",
  {
    id_user: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      select: false,
    },
    passToken: {
      type: DataTypes.STRING,
      allowNull: true,
      select: false,
    },
    id_role: {
      type: DataTypes.INTEGER,
      references: {
        model: modelRole,
        key: "id_role",
      },
    }
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

// Метод для установки пароля
modelUser.prototype.setPassword = async function (password) {
  this.password = password;

  this.passToken = crypto.pbkdf2Sync(
    password,
    crypto.randomBytes(8).toString("hex"),
    1000,
    32,
    "sha512"
  ).toString("hex");
  console.log(this.passToken);
};

// Метод для проверки пароля
modelUser.prototype.validPassword = async function (password) {
  const hash = crypto
        .pbkdf2Sync(password, this.passToken.substring(0, 16), 1000, 32, "sha512")
        .toString("hex");
    return hash === this.passToken;
};

modelUser.prototype.toObject = function () {
  const values = { ...this.get() };
  delete values.id_user; // Исправлено на id_user
  return values;
};

// Преобразование в JSON
modelUser.prototype.toJSON = function () {
  const values = { ...this.get() };
  // delete values.id_user;
  return values;
};

//Проверка, что данный пользователь - это администратор
modelUser.prototype.isAdmin = function() {
  return this.id_role === 2; 
};


(async () => {
  // Синхронизация моделей с базой данных без удаления существующих данных
  await sequelize.sync();
})();
module.exports = { modelUser };

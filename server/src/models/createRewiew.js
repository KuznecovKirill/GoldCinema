const { Sequelize } = require("sequelize");
const modelUser = require("./modelUser"); // Импортируйте модель пользователя
const modelRewiew = require("./modelRewiew"); // Импортируйте модель отзыва

const sequelize = require("./database").sequelize;

(async () => {
  // Синхронизация моделей с базой данных без удаления существующих данных
  await sequelize.sync();

  // Проверка существования пользователя перед созданием отзыва
  const userId = 2; // Замените на существующий id_user

  try {
    // Создание отзыва с использованием существующего пользователя
    const newReview = await modelRewiew.create({
      id_user: userId, // Используем существующий id_user
      id_media: 1, // Пример значения id_media (можно заменить на реальное значение)
      rating_user: 4.5, // Пример рейтинга
      comment_text: "Отличный фильм!", // Пример текста комментария
    });

    console.log("Отзыв создан:", newReview.toJSON()); // Выводим созданный отзыв в консоль
  } catch (error) {
    console.error("Ошибка при создании отзыва:", error);
  }
})();

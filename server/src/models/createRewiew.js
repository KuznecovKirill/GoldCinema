const { Sequelize } = require("sequelize");
const modelUser = require("./modelUser"); // Импортирт модели пользователя
const { modelRewiew } = require("./modelRewiew"); 
const swaggerUrl = require('../swagger/swagger.config');
const {modelMedia} = require('./modelMedia');
require('dotenv').config();

const sequelize = require("./database").sequelize;
//'collections?type=TOP_POPULAR_ALL&page=1'

//Получение списка популярных фильмов
async function getMovie() {
  let url = swaggerUrl.getUrl('v2.2/', 'films/', '2345');
  console.log(url);
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": process.env.KEY,
    },
  });
  const newMedia = await res.json();
  console.log(newMedia);
  console.log(newMedia.countries[0]);
  await modelMedia.create({
    title: newMedia.nameRu,
    country: newMedia.countries[0].country,
    genre: newMedia.genres[0].genre,
    running_time: newMedia.filmLength,
    rars: newMedia.ratingAgeLimits,
    rating: newMedia.ratingImdb,
    descrition: newMedia.description,
    poster: newMedia.posterUrlPreview
  });
  sequelize.sync();
}
getMovie();
// (async () => {
//   // Синхронизация моделей с базой данных без удаления существующих данных
//   await sequelize.sync();

//   // Проверка существования пользователя перед созданием отзыва
//   const userId = 2; // Замените на существующий id_user

//   try {
//     // Создание отзыва с использованием существующего пользователя
//     const newReview = await modelRewiew.create({
//       id_user: userId, // Используем существующий id_user
//       id_media: 1, // Пример значения id_media (можно заменить на реальное значение)
//       rating_user: 4.5, // Пример рейтинга
//       comment_text: "Отличный фильм!", // Пример текста комментария
//     });

//     console.log("Отзыв создан:", newReview.toJSON()); // Выводим созданный отзыв в консоль
//   } catch (error) {
//     console.error("Ошибка при создании отзыва:", error);
//   }
// })();

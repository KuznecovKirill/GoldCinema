const { Sequelize } = require("sequelize");
const modelUser = require("./modelUser"); // Импортирт модели пользователя
const { modelRewiew } = require("./modelRewiew"); 
const swaggerUrl = require('../swagger/swagger.config');
const {swaggerAPI} = require('../swagger/swagger.api');
const {modelMedia} = require('./modelMedia');
require('dotenv').config();

const sequelize = require("./database").sequelize;

//Получение фильма по ID
async function getMovie() {
  const newMedia = await swaggerAPI.mediaByID({id: 301}); 
  // let url = swaggerUrl.getUrl('v2.2/', 'films/', '301');
  // console.log(url);
  // const res = await fetch(url, {
  //   method: 'GET',
  //   headers: {
  //     "Content-Type": "application/json",
  //     "X-API-KEY": process.env.KEY,
  //   },
  // });
  // const newMedia = await res.json();
  console.log(newMedia);
  console.log(newMedia.countries);
  await modelMedia.create({
    title: newMedia.nameRu,
    country: newMedia.countries.map(c => c.country).join(', '), //список фильмов
    genre: newMedia.genres.map(g => g.genre).join(', '), //список жанров
    running_time: newMedia.filmLength,
    rars: `${newMedia.ratingAgeLimits.replace(/\D/g, '')}+`, //удаление всех нечисловых символов и добавление плюса на конце
    rating: newMedia.ratingImdb,
    descrition: newMedia.description,
    poster: newMedia.posterUrlPreview
  });
  sequelize.sync();
}
//Получение списка фильмов
async function getMovies() {
  const newCollection = await swaggerAPI.mediaCollections({type:'TOP_POPULAR_ALL', page: '1'});
  newCollection.items.forEach(async (item) => {
    console.log(item.nameRu);
    await modelMedia.create({
        title: item.nameRu,
        country: item.countries.map(c => c.country).join(', '),
        genre: item.genres.map(g => g.genre).join(', '),
        running_time: item.filmLength || null,
        rars: item.ratingAgeLimits ? `${item.ratingAgeLimits.replace(/\D/g, '')}+` : null,
        rating: item.ratingImdb || null,
        descrition: item.description || null,
        poster: item.posterUrlPreview || null
    });
});
sequelize.sync();
}
async function getSimilars() {
  
}
getMovies();
// getMovie();
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

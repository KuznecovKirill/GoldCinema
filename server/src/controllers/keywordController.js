const responseHandler = require("../handlers/response.handler");
const { modelKeyWord } = require("../models/modelKeyWord");
const { modelMedia } = require("../models/modelMedia.js");
const sequelize = require("../models/database").sequelize;

const natural = require("natural");
const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmerRu;

const stopWords = [
  "в",
  "на",
  "к",
  "по",
  "с",
  "из",
  "у",
  "за",
  "от",
  "до",
  "и",
  "а",
  "но",
  "или",
  "как",
  "что",
  "чтобы",
  "если",
  "бы",
  "же",
  "ли",
  "что-то",
];

function processText(text) {
  let tokens = tokenizer.tokenize(text);
  tokens = tokens.filter((token) => !stopWords.includes(token)); //удаляются различные предлоги и частицы
  return tokens
    .map((token) => stemmer.stem(token.toLowerCase())) // Применяем стемминг и приводим к нижнему регистру
    .filter((token) => token.length > 2); // Убираем слова длиной 1-2 буквы
}

// Функция для сравнения тегированных токенов
function compareTags(queryTags, descriptionTags) {
  let matchCount = 0;

  // Сравниваем каждый токен запроса с каждым токеном описания
  descriptionTags.forEach((descTag) => {
    queryTags.forEach((queryTag) => {
      if (queryTag.toLowerCase() === descTag.toLowerCase()) {
        matchCount++;
      }
    });
  });
  console.log((matchCount / queryTags.length) * 100);
  return (matchCount / queryTags.length) * 100;
  // return matchCount;
}
// Функция для вычисления коэффициента соответствия
function calculateSimilarity(movie, queryTags) {
  const combinedText = `${movie.title} ${movie.genres.join(" ")} ${
    movie.description
  }`;
  const descriptionTags = processText(combinedText); //информация о фильме

  const intersection = compareTags(queryTags, descriptionTags);
  console.log(`${(intersection / queryTags.length) * 100}`);
  return (intersection / queryTags.length) * 100;
}


async function search(userQuerry){
  try {
    const keywords = await modelKeyWord.findAll();
    const keywordsTags = keywords.map((keyword) => {
      return {
        ...keyword.get({ plain: true }), //Преобразование в JavaScript объект
        keywords: keyword.keywords ? keyword.keywords.split(" ") : [], // Разбиваем строку на массив слов, если keywords не null
      };
    });

    const queryTags = processText(userQuerry); // Запрос пользователя преобразуется
    const results = keywordsTags
      .map((keyword) => {
        const score = compareTags(queryTags, keyword.keywords); //Оценка соответствия
        return { ...keyword, score };
      })
      .filter((keyword) => keyword.score >= 10);
    results.sort((a, b) => b.score - a.score);

    console.log("Результаты поиска:");
    results.forEach((keyword) => {
      console.log(`- ${keyword.id_media} с соответствием ${keyword.score}%`);
    });
    //Подготовка к responseHandler
    const idMediaList = results.map(keyword => ({
      id_media: keyword.id_media,
      score: keyword.score
    }));
    return idMediaList;
  } catch (error) {
    console.error(error);
  }
}



//curl -X POST -H "Content-Type: application/json" -d '{"id_media": "466581"}' http://localhost:8000/keyword
const addInfo = async (req, res) => {
  try {
    const { id_media } = req.body;
    const media = await modelMedia.findByPk(id_media);
    const combineText = `${media.title} ${media.genre.replace(/,\s*/g, " ")} ${
      media.mediaType
    } ${media.country} ${media.descrition}`;
    const newText = processText(combineText).join(" ");
    console.log(newText);
    const keywords = await modelKeyWord.create({
      id_media: id_media,
      keywords: newText,
    });
    sequelize.sync();
    responseHandler.created(res, {
      keywords,
    });
  } catch (error) {
    console.error("Ошибка:", error);
  }
};
//curl -X POST "http://localhost:8000/keyword/search" -H "Content-Type: application/json" -d '{"userQuerry": "фильм про зеленого чувака, который крадёт Рождество и он злой"}'
// const search = async (req, res) => {
//   try {
//     const { userQuerry } = req.body;
//     const keywords = await modelKeyWord.findAll();
//     const keywordsTags = keywords.map((keyword) => {
//       return {
//         ...keyword.get({ plain: true }), //Преобразование в JavaScript объект
//         keywords: keyword.keywords ? keyword.keywords.split(" ") : [], // Разбиваем строку на массив слов, если keywords не null
//       };
//     });

//     const queryTags = processText(userQuerry); // Запрос пользователя преобразуется
//     const results = keywordsTags
//       .map((keyword) => {
//         const score = compareTags(queryTags, keyword.keywords); //Оценка соответствия
//         return { ...keyword, score };
//       })
//       .filter((keyword) => keyword.score >= 10);
//     results.sort((a, b) => b.score - a.score);

//     console.log("Результаты поиска:");
//     results.forEach((keyword) => {
//       console.log(`- ${keyword.id_media} с соответствием ${keyword.score}%`);
//     });
//     //Подготовка к responseHandler
//     const idMediaList = results.map(keyword => ({
//       id_media: keyword.id_media,
//       score: keyword.score
//     }));

//     responseHandler.goodrequest(res, {
//       searchResult: idMediaList,
//     });
//     return idMediaList;
//   } catch (error) {
//     console.error(error);
//   }
// };





module.exports = { addInfo, processText, search };

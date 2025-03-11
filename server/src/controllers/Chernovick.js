

// function processText(text) {
//   let tokens = tokenizer.tokenize(text);
//   tokens = tokens.filter((token) => !stopWords.includes(token)); //удаляются различные предлоги и частицы
//   return tokens
//     .map((token) => stemmer.stem(token.toLowerCase())) // Применяем стемминг и приводим к нижнему регистру
//     .filter((token) => token.length > 2); // Убираем слова длиной 1-2 буквы
// }

// function processText(text) {
//   let tokens = tokenizer.tokenize(text);
//   tokens = tokens.filter((token) => !stopWords.includes(token));
//   const stemmedTokens = tokens
//     .map((token) => stemmer.stem(token.toLowerCase()))
//     .filter((token) => token.length > 2);

//   // Добавляем новые слова в глобальный словарь
//   stemmedTokens.forEach((token) => globalVocabulary.add(token));
//   return stemmedTokens;
// }


// Функция для сравнения тегированных токенов
// function compareTags(queryTags, descriptionTags) {
//   let matchCount = 0;

//   // Сравниваем каждый токен запроса с каждым токеном описания
//   descriptionTags.forEach((descTag) => {
//     queryTags.forEach((queryTag) => {
//       if (queryTag.toLowerCase() === descTag.toLowerCase()) {
//         matchCount++;
//       }
//     });
//   });
//   console.log((matchCount / queryTags.length) * 100);
//   return (matchCount / queryTags.length) * 100;
//   // return matchCount;
// }


// async function search(userQuerry){
//   try {
//     const keywords = await modelKeyWord.findAll();
//     const keywordsTags = keywords.map((keyword) => {
//       const keywordsArray = keyword.keywords
//         ? keyword.keywords.split(" ")
//         : [];
//       keywordsArray.forEach((word) => globalVocabulary.add(word)); // Обновляем глобальный словарь
//       return {
//         ...keyword.get({ plain: true }),
//         keywords: keywordsArray,
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
//     return idMediaList;
//   } catch (error) {
//     console.error(error);
//   }
// }
const responseHandler = require("../handlers/response.handler");
const { modelKeyWord } = require("../models/modelKeyWord");
const { modelMedia } = require("../models/modelMedia.js");
const sequelize = require("../models/database").sequelize;

const natural = require("natural");
const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmerRu;

const TfIdf = natural.TfIdf;
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
let globalVocabulary = new Set();

function processText(text) {
  let tokens = tokenizer.tokenize(text);
  tokens = tokens.filter((token) => !stopWords.includes(token));
  const stemmedTokens = tokens
    .map((token) => stemmer.stem(token.toLowerCase()))
    .filter((token) => token.length > 2);
  console.log(stemmedTokens);
  return stemmedTokens;
}
// Функция для вычисления TF-IDF векторов
function calculateTfIdf(documents, query) {
  const tfidf = new TfIdf();

  // Добавляем документы в TF-IDF
  documents.forEach((document) => {
    tfidf.addDocument(document);
  });

  // Добавляем запрос как отдельный документ
  tfidf.addDocument(query);

  // Получаем вектор TF-IDF для запроса
  let queryVector = {};
  const queryIndex = documents.length; // Индекс запроса
  tfidf.listTerms(queryIndex).forEach((item) => {
    queryVector[item.term] = item.tf;
  });

  return { tfidf, queryVector };
}

function cosineSimilarity(vectorA, vectorB) {
  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let term in vectorA) {
    if (vectorB.hasOwnProperty(term)) {
      dotProduct += vectorA[term] * vectorB[term];
    }
    magnitudeA += Math.pow(vectorA[term], 2);
  }

  for (let term in vectorB) {
    magnitudeB += Math.pow(vectorB[term], 2);
  }

  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return dotProduct / (magnitudeA * magnitudeB);
}
function compareTags(queryVector, descriptionVector) {
  // Используем косинусное расстояние для сравнения векторов
  const similarity = queryVector.cosineSimilarity(descriptionVector);
  return similarity; // Возвращаем значение косинусной близости
}

async function search(userQuerry) {
  try {
    const keywords = await modelKeyWord.findAll();
    // Обрабатываем все keywords и получаем тексты
    const keywordsTexts = keywords.map((keyword) => {
      const keywordsArray = keyword.keywords
        ? keyword.keywords.split(" ")
        : [];
      return {
        ...keyword.get({ plain: true }),
        keywords: keywordsArray.join(" "), // Объединяем в текст для TF-IDF
      };
    });

    // Создаем документы для TF-IDF
    const documents = keywordsTexts.map((item) => item.keywords);
    // Вычисляем TF-IDF
    const { tfidf, queryVector } = calculateTfIdf(
      documents,
      processText(userQuerry).join(" ")
    );
    console.log(queryVector);
    // Сравниваем запрос с каждым документом
    const results = keywordsTexts
      .map((keyword, index) => {
        let documentVector = {};
        tfidf.listTerms(index).forEach((item) => {
          documentVector[item.term] = item.tf;
        });
        const score = cosineSimilarity(queryVector, documentVector); // Вычисляем косинусную близость
        return { ...keyword, score };
      })
      .filter((keyword) => keyword.score > 0); // Фильтруем результаты

    results.sort((a, b) => b.score - a.score);

    console.log("Результаты поиска:");
    results.forEach((keyword) => {
      console.log(
        `- ${keyword.id_media} с соответствием ${
          keyword.score * 100
        }%`
      );
    });

    // Подготовка к responseHandler
    const idMediaList = results.map((keyword) => ({
      id_media: keyword.id_media,
      score: keyword.score,
    }));

    // Сортируем idMediaList по убыванию score
    idMediaList.sort((a, b) => b.score - a.score);

    return idMediaList;
  } catch (error) {
    console.error(error);
    // Обработка ошибок
    throw error;
  }
}
const addInfo = async (req, res) => {
  try {
    const { id_media } = req.body;
    const media = await modelMedia.findByPk(id_media);
    const combineText = `${media.title} ${media.genre.replace(/,\s*/g, " ")} ${
      media.mediaType
    } ${media.country} ${media.descrition}`;
    const newText = processText(combineText).join(" ");
    //Обновление словаря
    newText.split(" ").forEach((word) => globalVocabulary.add(word));
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
module.exports = { addInfo, processText, calculateTfIdf, search };


          // if (error.name == "SequelizeUniqueConstraintError") {
          //   console.log("Такой фильм уже существует!");
          //   responseHandler.error(res);
          // } else {
          //   console.error("Ошибка при добавлении фильма:", error);
          //   responseHandler.error(res);
          // }



            // //Promise.all, чтобы дождаться завершения всех асинхронных операций
  // await Promise.all(
  //   topMedias.items.map(async (item) => {
  //     if (item.nameRu !== null) {
  //       try {
  //         const result = await modelMediaCreate(item);
  //         if (result && result.error) {
  //           errors.push(result.error);
  //         }
  //         else if (result){
  //           console.log("Популярный фильм добавлен!");
  //           addedMedias.push(result);
  //         }
  //         else {
  //           console.log("Фильм не был добавлен");
  //         }
  //       } catch (error) {
  //         console.error("Произошла неожиданная ошибка:", error);
  //         errors.push("Произошла неожиданная ошибка");

  //       }
  //     }
  //   })
  // );
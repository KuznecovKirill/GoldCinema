const responseHandler = require("../handlers/response.handler");
const { modelKeyWord } = require("../models/modelKeyWord");
const { modelMedia } = require("../models/modelMedia.js");
const { modelReview } = require("../models/modelReview");
const sequelize = require("../models/database").sequelize;
const { Op } = require("sequelize");
const natural = require("natural");
const tokenizer = new natural.WordTokenizer();

const { TfIdf } = natural;
const stopWords = [ "в", "на", "к", "по","с","из","у","за","от","до","и","а","но","или","как","что","чтобы","если","бы","же","ли","что-то","...","для","про"];
// Правила замены
const replacements = {
  FILM: "фильм",
  TV_SERIES: "сериал",
  "18+": "для взрослых 18",
  "16+": "для подростков 16",
  "12+": "для детей старше 12 лет",
  "6+": "для детей старше 6 лет",
  "0+": "для всех возрастов",
};
let globalVocabulary = new Set();

//Для python-файла
const { spawn } = require("child_process");
const path = require("path");
const { modelGenre } = require("../models/modelGenre.js");
const { where } = require("sequelize");

async function lemmatizeText(text) {
  return new Promise((resolve, reject) => {
    const python = spawn("python", [
      path.join(__dirname, "..", "..", "python", "lemmatize.py"),
      text,
    ]); // Путь к скрипту!
    let data = "";
    let error = "";

    python.stdout.on("data", (chunk) => {
      data += chunk;
    });

    python.stderr.on("data", (chunk) => {
      error += chunk;
    });

    python.on("close", (code) => {
      if (code !== 0) {
        console.error(
          `Ошибка от Python скрипта, код: ${code}, сообщение: ${error}`
        );
        reject(new Error(`Python script failed with code ${code}: ${error}`));
      } else {
        try {
          const lemmas = JSON.parse(data);
          resolve(lemmas);
        } catch (parseError) {
          console.error("Ошибка парсинга JSON:", parseError);
          reject(parseError);
        }
      }
    });
  });
}

// Функция для замены слов
function replaceWords(text, replacements) {
  for (const [key, value] of Object.entries(replacements)) {
    const regex = new RegExp(`\\b${key}\\b`, "g"); // Регулярное выражение для точного совпадения слова
    text = text.replace(regex, value);
  }
  return text;
}

async function processText(text) {
  let tokens = tokenizer.tokenize(text);
  tokens = tokens.filter((token) => !stopWords.includes(token.toLowerCase()));
  try {
    const lemmas = await lemmatizeText(text);
    const filteredLemmas = lemmas.filter(
      (lemma) => lemma.length > 2 && !stopWords.includes(lemma.toLowerCase())
    ); // Добавлена проверка на стоп-слова после лемматизации

    return filteredLemmas;
  } catch (error) {
    console.error("Ошибка в lemmatizeText:", error);
    throw error;
  }
}

//Нормализация вектора
function normalizeVector(vector) {
  let sumSquares = 0;
  for (const term in vector) {
    sumSquares += vector[term] * vector[term];
  }
  const magnitude = Math.sqrt(sumSquares);
  if (magnitude === 0) return vector; // или вернуть пустой вектор
  const normalized = {};
  for (const term in vector) {
    normalized[term] = vector[term] / magnitude;
  }
  return normalized;
}

// Функция для вычисления TF-IDF векторов
function calculateTfIdf(documents, query) {
  const tfidf = new TfIdf();

  // Сбор Мешка слов из документа и добавление документов в TF-IDF
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
  queryVector = normalizeVector(queryVector);
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
async function search(userQuerry, idList) {
  try {
    const keywords = await modelKeyWord.findAll({
      where: {
        id_media: {
          [Op.in]: idList,
        },
      },
    });
    // Преобразование keywords в текстовый вид
    const keywordsTexts = keywords.map((keyword) => {
      const keywordsArray = keyword.keywords ? keyword.keywords.split(" ") : [];
      return {
        ...keyword.get({ plain: true }),
        keywords: keywordsArray.join(" "), // Обьединение в текст
      };
    });

    // Создаем документы для TF-IDF
    const documents = keywordsTexts.map((item) => item.keywords);
    // Вычисляем TF-IDF
    const processedQuery = await processText(userQuerry); // Обработка пользовательского запроса
    const { tfidf, queryVector } = calculateTfIdf(
      documents,
      processedQuery.join(" ")
    );
    console.log(queryVector);


    // Сравнение запроса с каждым документом
    const results = keywordsTexts
      .map((keyword, index) => {
        let documentVector = {};
        tfidf.listTerms(index).forEach((item) => {
          documentVector[item.term] = item.tf;
        });
        documentVector = normalizeVector(documentVector);
        const score = cosineSimilarity(queryVector, documentVector); // Вычисляем косинусную близость
        return { ...keyword, score };
      })
      .filter((keyword) => keyword.score > 0.03); // Фильтруем результаты

    results.sort((a, b) => b.score - a.score);

    console.log("Результаты поиска:");
    results.forEach((keyword) => {
      console.log(
        `- ${keyword.id_media} с соответствием ${keyword.score * 100}%`
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
async function addInfo(id_media) {
  try {

    const media = await modelMedia.findByPk(id_media, {
      include: [
        {
          model: modelGenre,
          as: "Genres",
          attributes: ["name_genre"],
        },
      ],
    });
    // Извлекаем жанры в виде массива строк
    const genresArray = media.Genres.map((genre) => genre.name_genre);

    // Объединяем жанры в строку через пробел
    const genresString = genresArray.join(" ");

    const reviewsArray = await modelReview.findAll({
      where: { id_media: id_media },
      order: [["id_review", "DESC"]],
      attributes: ["comment_text"],
    });
    let reviewsText = reviewsArray
      .map((review) => review.comment_text)
      .join(" ");
    console.log(reviewsText);

    const combine = `${media.title} ${genresString} ${media.mediaType} ${media.country} ${media.descrition} ${media.rars}, ${reviewsText}`;

    const combineText = replaceWords(combine, replacements); //Замена слов
    console.log(combineText);
    const newText = await processText(combineText); // Лемматизируем текст
    let newTextString = newText.join(" ");
    //Обновление словаря
    newText.forEach((word) => globalVocabulary.add(word));
    console.log(newTextString);

    // Удаление повторов слов "фильм" и "сериал"
    const words = newTextString.split(" ");
    const uniqueWords = [];

    //для проверки их существования
    const filmCount = words.filter((word) => word === "фильм").length; 
    const serialCount = words.filter((word) => word === "сериал").length;

    // Добавление слова "фильм" один раз, если оно есть
    if (filmCount > 0) {
      uniqueWords.push("фильм");
    }

    // Добавляем слова "сериал" один раз, если оно есть
    if (serialCount > 0) {
      uniqueWords.push("сериал");
    }

    // Добавление остальных слов, исключая повторы "фильм" и "сериал"
    words.forEach((word) => {
      if (
        word !== "фильм" &&
        word !== "сериал" &&
        !uniqueWords.includes(word)
      ) {
        uniqueWords.push(word);
      }
    });

    newTextString = uniqueWords.join(" ");

    const isKeyword = await modelKeyWord.findOne({
      where: { id_media: id_media },
    });
    if (isKeyword) {
      const existingKeywords = isKeyword.keywords;
      const updatedKeywords = existingKeywords + " " + newTextString;

      await modelKeyWord.update(
        { keywords: updatedKeywords },
        { where: { id_media: id_media } }
      );

      sequelize.sync();
      return {
        message: "Keywords updated successfully",
        keywords: updatedKeywords,
      };
      // Добавить текст
    } else {
      const keywords = await modelKeyWord.create({
        id_media: id_media,
        keywords: newTextString,
      });

      sequelize.sync();
      return keywords;
    }
  } catch (error) {
    console.error("Ошибка:", error);
  }
}

module.exports = { addInfo, processText, calculateTfIdf, search };

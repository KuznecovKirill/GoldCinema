const responseHandler = require("../handlers/response.handler");
const { modelKeyWord } = require("../models/modelKeyWord");
const { modelMedia } = require("../models/modelMedia.js");
const sequelize = require("../models/database").sequelize;

const natural = require("natural");
const tokenizer = new natural.WordTokenizer();

const { TfIdf } = natural;
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
  "...",
];
let globalVocabulary = new Set();

//Для python-файла
const { spawn } = require("child_process");
const path = require("path");
const { modelGenre } = require("../models/modelGenre.js");

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

// async function processText(text) {
//     let tokens = tokenizer.tokenize(text);
//     tokens = tokens.filter(token => !stopWords.includes(token.toLowerCase())); // Важно: toLowerCase()
//     try {
//         const lemmas = await lemmatizeText(text);
//         const filteredLemmas = lemmas.filter(lemma => lemma.length > 2);
//         console.log(filteredLemmas);
//         return filteredLemmas;
//     } catch (error) {
//         console.error("Ошибка в lemmatizeText:", error);
//         return []; // Важно: возвращаем пустой массив, чтобы не сломать дальнейшую обработку
//     }
// }

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
async function search(userQuerry) {
  try {
    const keywords = await modelKeyWord.findAll();
    // Обрабатываем все keywords и получаем тексты
    const keywordsTexts = keywords.map((keyword) => {
      const keywordsArray = keyword.keywords ? keyword.keywords.split(" ") : [];
      return {
        ...keyword.get({ plain: true }),
        keywords: keywordsArray.join(" "), // Объединяем в текст для TF-IDF
      };
    });

    // Создаем документы для TF-IDF
    const documents = keywordsTexts.map((item) => item.keywords);
    // Вычисляем TF-IDF
    const processedQuery = await processText(userQuerry); // Лемматизируем запрос
    const { tfidf, queryVector } = calculateTfIdf(
      documents,
      processedQuery.join(" ")
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
    // const { id_media } = req.body;
    //const media = await modelMedia.findByPk(id_media);
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
    console.log(`Строка жанров ${genresString}`);

    const combineText = `${media.title} ${genresString} ${
      media.mediaType
    } ${media.country} ${media.descrition}`;
    const newText = await processText(combineText); // Лемматизируем текст
    const newTextString = newText.join(" ");
    //Обновление словаря
    newText.forEach((word) => globalVocabulary.add(word));
    console.log(newTextString);

    const keywords = await modelKeyWord.create({
      id_media: id_media,
      keywords: newTextString,
    });
    sequelize.sync();
    return keywords;
    // responseHandler.created(res, {
    //     keywords
    // });
  } catch (error) {
    console.error("Ошибка:", error);
  }
}

module.exports = { addInfo, processText, calculateTfIdf, search };

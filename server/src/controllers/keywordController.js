const responseHandler = require("../handlers/response.handler");
const { modelKeyWord } = require("../models/modelKeyWord");
const { modelMedia } = require("../models/modelMedia.js");
const sequelize = require("../models/database").sequelize;

const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmerRu;

const stopWords = [
    "в", "на", "к", "по", "с", "из", "у", "за", "от", "до", 
    "и", "а", "но", "или", "как", "что", "чтобы", "если",
    "бы", "же", "ли", "что-то"
  ];

function processText(text) {
    let tokens = tokenizer.tokenize(text);
    tokens = tokens.filter(token => !stopWords.includes(token)); //удаляются различные предлоги и частицы
    return tokens
      .map(token => stemmer.stem(token.toLowerCase())) // Применяем стемминг и приводим к нижнему регистру
      .filter(token => token.length > 2); // Убираем слова длиной 1-2 буквы
  }


const addInfo = async (req, res) => {
  try {
    const { id_media } = req.body;
    const media = await modelMedia.findByPk(id_media);
    const combineText = `${media.title} ${media.genre.replace(/,\s*/g, ' ')} ${media.mediaType} ${media.country} ${media.descrition}`;
    const newText = processText(combineText).join(' ');
    console.log(newText);
    const keywords = await modelKeyWord.create({
        id_media: id_media,
        keywords: newText
    });
    sequelize.sync();
    responseHandler.created(res, {
          keywords
        });
  } catch (error) {
    console.error("Ошибка:", error);
  }
};
module.exports = { addInfo, processText };
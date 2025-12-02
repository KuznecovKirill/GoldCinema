const fetch = require('node-fetch');
const { modelImage } = require("../models/modelImage.js");
const { modelKeyWord } = require("../models/modelKeyWord.js");
const { processText } = require("./keywordController.js");
const sequelize = require("../models/database").sequelize;
const { Op } = require("sequelize");
/**
 * Перевод текста на русский через Google Translate API
 */
async function translateText(text, targetLanguage = 'ru') {
    if (!text || text.length === 0) {
        return '';
    }
    try {
        console.log(`Перевод текста: "${text.substring(0, 50)}..."`);

        const encodedText = encodeURIComponent(text);
        const googleUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLanguage}&dt=t&q=${encodedText}`;

        const response = await fetch(googleUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0'
            },
            timeout: 10000
        });

        if (!response.ok) {
            console.warn('Google Translate недоступен');
            return text;
        }

        const data = await response.json();

        let translated = "";
        // Google API возвращает массив: [[[translated_text, original_text],...],...]
        for (let item of data[0]){
          if (Array.isArray(item) && item){
            translated += item[0];
          }
        }
        console.log(`Переведено: "${translated}"`);
        if (translated)
          return translated;
        else
          return text;

    } catch (error) {
        console.error('Ошибка перевода:', error.message);
        return text;  // Возвращаем оригинальный текст если перевод не прошёл
    }
}

/**
 * Анализ изображения с bakllava на английском
 * затем переводи результата на русский
 */
async function analyzeImageWithVisionAndTranslate(imageUrl) {
    try {
        console.log(`Загрузка изображения: ${imageUrl}`);
        
        const imageResponse = await fetch(imageUrl);
        const imageBuffer = await imageResponse.buffer();
        const base64Image = imageBuffer.toString('base64');

        // Анализируем на английском (bakllava работает хорошо)
        const promptEnglish = `Describe this image from a movie scene briefly using key words only:
- who/characters
- what's happening
- objects/items
- film genres
- atmosphere

Answer in 1-2 sentences, key words only.`;

        console.log(`Анализ через Ollama (bakllava)`);

        const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'qwen3',
                prompt: promptEnglish,
                images: [base64Image],
                stream: false,
                options: {
                    temperature: 0.1,
                    num_predict: 150
                }
            }),
            timeout: 120000
        });

        if (!response.ok) {
            throw new Error(`Ollama error: ${response.status}`);
        }

        const data = await response.json();
        let englishDescription = (data.response || '').trim();

        console.log(`Английский: "${englishDescription}"`);

        if (!englishDescription || englishDescription.length === 0) {
            console.warn('Пустой ответ от bakllava');
            return '';
        }

        // Перевод на русский через Google Translate
        const russianDescription = await translateText(englishDescription, 'ru');

        console.log(`Русский: "${russianDescription}"`);
        
        return russianDescription;

    } catch (error) {
        console.error('Ошибка анализа:', error.message);
        return '';
    }
}

/**
 * Обработка непроанализированных изображений
 */
async function processMediaImages(id_media) {
    try {
        const images = await modelImage.findAll({
            where: {
                id_media: id_media,
                [Op.or]: [
                    { isAnalyzed: false },
                    { isAnalyzed: { [Op.is]: null } }
                ]
            },
            limit: 3
        });

        if (images.length === 0) {
            console.log(`Нет новых изображений для медиа ID: ${id_media}`);
            return;
        }

        console.log(`\nОбработка ${images.length} изображений для медиа ID: ${id_media}\n`);

        const imageDescriptions = [];

        for (const image of images) {
            try {
                console.log(`\n--- Изображение ${image.id_image} ---`);
                const description = await analyzeImageWithVisionAndTranslate(image.imageUrl);
                
                if (description && description.length > 3) {
                    imageDescriptions.push(description);

                    await modelImage.update(
                        { isAnalyzed: true },
                        { where: { id_image: image.id_image } }
                    );

                    console.log(`Обработано успешно`);
                } else {
                    console.warn(`Пустое описание`);
                    await modelImage.update(
                        { isAnalyzed: true },
                        { where: { id_image: image.id_image } }
                    );
                }
            } catch (imageError) {
                console.error(`Ошибка:`, imageError.message);
                await modelImage.update(
                    { isAnalyzed: true },
                    { where: { id_image: image.id_image } }
                );
            }
            
            // Задержка между изображениями
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        if (imageDescriptions.length === 0) {
            console.log('Нет описаний');
            return;
        }

        const combinedDescription = imageDescriptions.join(' ');
        console.log(`\nОбъединённое: ${combinedDescription}`);

        const processedKeywords = await processText(combinedDescription);
        const keywordsString = processedKeywords.join(' ');

        if (!keywordsString || keywordsString.length === 0) {
            console.log('Ключевые слова не найдены');
            return;
        }

        console.log(`Ключевые слова: ${keywordsString}\n`);

        const existingKeyword = await modelKeyWord.findOne({
            where: { id_media: id_media }
        });

        if (existingKeyword) {
            const updatedKeywords = `${existingKeyword.keywords} ${keywordsString}`;
            const uniqueKeywords = [...new Set(updatedKeywords.split(' '))]
                .filter(word => word.trim().length > 0)
                .join(' ');
            
            await modelKeyWord.update(
                { keywords: uniqueKeywords },
                { where: { id_media: id_media } }
            );
            console.log(`Ключевые слова обновлены`);
        } else {
            await modelKeyWord.create({
                id_media: id_media,
                keywords: keywordsString
            });
            console.log(`Ключевые слова созданы`);
        }

        await sequelize.sync();

    } catch (error) {
        console.error(`Ошибка обработки:`, error);
        throw error;
    }
}

module.exports = {
    analyzeImageWithVisionAndTranslate,
    processMediaImages
};

const fetch = require('node-fetch');
const { modelImage } = require("../models/modelImage.js");
const { modelKeyWord } = require("../models/modelKeyWord.js");
const { processText } = require("./keywordController.js");
const sequelize = require("../models/database").sequelize;
const { Op } = require("sequelize");

// Hugging Face API token (получить на https://huggingface.co/settings/tokens)
const HF_API_TOKEN = process.env.HF_API_TOKEN || 'YOUR_HUGGINGFACE_TOKEN_HERE';
const HF_API_URL = 'https://api-inference.huggingface.co/models/deepvk/llava-saiga-8b';

/**
 * Анализирует изображение с помощью LLaVA-Saiga на Hugging Face
 * Модель специализирована на русском языке
 */
async function analyzeImageWithVisionSaiga(imageUrl) {
    try {
        console.log(`📷 Загрузка изображения: ${imageUrl}`);
        
        // Загружаем изображение в base64
        const imageResponse = await fetch(imageUrl);
        const imageBuffer = await imageResponse.buffer();
        const base64Image = imageBuffer.toString('base64');
        
        const mimeType = 'image/jpeg';

        // Промпт на русском для LLaVA-Saiga
        const prompt = `Опиши эту картинку из киноленты на русском языке кратко, ключевыми словами:
- кто персонажи
- что происходит
- какие предметы видны
- жанры киноленты
- какая атмосфера

Ответь ТОЛЬКО на русском, ключевыми словами без предложений.`;

        console.log(`🔄 Отправка запроса к LLaVA-Saiga на Hugging Face...`);

        const response = await fetch(HF_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${HF_API_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                inputs: {
                    image: `data:${mimeType};base64,${base64Image}`,
                    text: prompt
                }
            })
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('Ошибка HF API:', response.status, error);
            
            if (response.status === 429) {
                console.warn('⚠️ Слишком много запросов. Ожидание 60 секунд...');
                await new Promise(resolve => setTimeout(resolve, 60000));
                return await analyzeImageWithVisionSaiga(imageUrl);
            }
            
            throw new Error(`HF API error: ${response.status}`);
        }

        const data = await response.json();
        
        // LLaVA-Saiga возвращает результат в формате массива
        let description = '';
        
        if (Array.isArray(data) && data?.generated_text) {
            description = data.generated_text;
        } else if (data.generated_text) {
            description = data.generated_text;
        } else {
            console.warn('Неожиданный формат ответа:', JSON.stringify(data).substring(0, 200));
            description = JSON.stringify(data);
        }

        // Очищаем текст
        if (description.includes('Ответь ТОЛЬКО')) {
            description = description.split('Ответь ТОЛЬКО') || description;
        }
        
        description = description.trim();
        
        // Убираем повторения промпта
        const lines = description.split('\n');
        const cleanedLines = lines.filter(line => 
            !line.includes('картинку') && 
            !line.includes('русском') && 
            line.trim().length > 0
        );
        
        description = cleanedLines.join(' ').trim();

        console.log(`✅ Ответ от LLaVA-Saiga: "${description}"`);
        
        return description;

    } catch (error) {
        console.error('❌ Ошибка анализа изображения:', error.message);
        return '';
    }
}

/**
 * Обработка непроанализированных изображений с LLaVA-Saiga
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

        console.log(`\n📷 Обработка ${images.length} изображений (LLaVA-Saiga) для медиа ID: ${id_media}\n`);

        const imageDescriptions = [];

        for (const image of images) {
            try {
                console.log(`\n--- Изображение ${image.id_image} ---`);
                const description = await analyzeImageWithVisionSaiga(image.imageUrl);
                
                if (description && description.length > 0) {
                    imageDescriptions.push(description);

                    await modelImage.update(
                        { isAnalyzed: true },
                        { where: { id_image: image.id_image } }
                    );

                    console.log(`✓ Обработано`);
                } else {
                    console.warn(`⚠ Пустое описание`);
                }
            } catch (imageError) {
                console.error(`✗ Ошибка:`, imageError.message);
            }
            
            // Задержка между запросами
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        if (imageDescriptions.length === 0) {
            console.log('⚠️ Нет описаний');
            return;
        }

        const combinedDescription = imageDescriptions.join(' ');
        console.log(`\n📝 Объединённое описание: ${combinedDescription}`);

        const processedKeywords = await processText(combinedDescription);
        const keywordsString = processedKeywords.join(' ');

        console.log(`🔑 Ключевые слова: ${keywordsString}\n`);

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
        } else {
            await modelKeyWord.create({
                id_media: id_media,
                keywords: keywordsString
            });
        }

        await sequelize.sync();

    } catch (error) {
        console.error(`Ошибка обработки:`, error);
        throw error;
    }
}

module.exports = {
    analyzeImageWithVisionSaiga,
    processMediaImages
};
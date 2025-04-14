const puppeteer = require('puppeteer');
const axios = require('axios');
const cheerio = require('cheerio');

async function getKeywordsFromKinopoisk(url) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    const html = await page.content();
    const $ = cheerio.load(html);
    const keywords = [];

    $('a[data-real-keyword]').each((index, element) => {
      keywords.push($(element).text());
    });

    await browser.close();

    return keywords.join(', ');
  } catch (error) {
    console.error('Error scraping keywords:', error);
    return null;
  }
}

const url = 'https://www.kinopoisk.ru/film/301/keywords/';

getKeywordsFromKinopoisk(url)
  .then(keywordsText => {
    if (keywordsText) {
      console.log(keywordsText);
    }
  });

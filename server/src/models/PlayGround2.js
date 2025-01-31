// Импортируем библиотеки
const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const pos = require('pos');
const tagger = new pos.Tagger();
const stemmer = natural.PorterStemmerRu; // Стеммер для русского языка

const stopWords = [
  "в", "на", "к", "по", "с", "из", "у", "за", "от", "до", 
  "и", "а", "но", "или", "как", "что", "чтобы", "если",
  "бы", "же", "ли", "что-то"
];

// Пример базы данных с фильмами
const movies = [
  { title: "Интерстеллар", genres: ["фантастика", "приключения"], description: "Экипаж космического корабля отправляется в путешествие через червоточину в поисках новой планеты для человечества." },
  { title: "Матрица", genres: ["фантастика", "боевик"], description: "Человек узнает, что его мир — это симуляция, созданная машинами, и присоединяется к группе повстанцев." },
  { title: "Форрест Гамп", genres: ["драма"], description: "История о человеке с низким коэффициентом интеллекта, который случайно оказывается в центре важных исторических событий." }
];

// Функция для обработки текста
function processText(text) {
  let tokens = tokenizer.tokenize(text);
  tokens = tokens.filter(token => !stopWords.includes(token)); //удаляются различные предлоги и частицы
  return tokens
    .map(token => stemmer.stem(token.toLowerCase())) // Применяем стемминг и приводим к нижнему регистру
    .filter(token => token.length > 2); // Убираем слова длиной 1-2 буквы
}

// Функция для сравнения тегированных токенов
function compareTags(queryTags, descriptionTags) {
  let matchCount = 0;
  console.log(queryTags);
  console.log(descriptionTags);
  // Сравниваем каждый токен запроса с каждым токеном описания
  descriptionTags.forEach(descTag => {
    queryTags.forEach(queryTag => {
      if (queryTag.toLowerCase() === descTag.toLowerCase()) {
        matchCount++;
      }
    });
  });

  return matchCount;
}

// Функция для вычисления коэффициента соответствия
function calculateSimilarity(movie, queryTags) {
  const combinedText = `${movie.title} ${movie.genres.join(' ')} ${movie.description}`;
  const descriptionTags = processText(combinedText); //информация о фильме
  
  const intersection = compareTags(queryTags, descriptionTags);
  console.log(`${(intersection / queryTags.length) * 100}`);
  return (intersection / queryTags.length) * 100;
}

// Функция для поиска фильмов по описанию
function searchMoviesByDescription(query) {
  const queryTags = processText(query);

  // Сортировка фильмов по коэффициенту соответствия
  const sortedMovies = movies.filter(movie => calculateSimilarity(movie, queryTags) >= 10)
                            .sort((a, b) => calculateSimilarity(b, queryTags) - calculateSimilarity(a, queryTags));

  // Выводим первые 3 фильма
  return sortedMovies.slice(0, 3);
}

// Пример использования функции
const userQuery = "фильм, где мир является симуляцией а ещё там главный герой в повстанцах";
const results = searchMoviesByDescription(userQuery);

console.log("Результаты поиска:");
results.forEach(movie => {
  console.log(`- ${movie.title} (${movie.genres.join(', ')})`);
});

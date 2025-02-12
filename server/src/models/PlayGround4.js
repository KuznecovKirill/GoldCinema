const corpus = [
  "This is the Hugging Face Course.",
  "This chapter is about tokenization.",
  "This section shows several tokenizer algorithms.",
  "Hopefully, you will be able to understand how they are trained and generate tokens.",
];

// 1. Предварительная токенизация корпуса в слова (здесь используется простой метод)
function preTokenize(corpus) {
  return corpus.flatMap(sentence => sentence.split(" "));
}

let words = preTokenize(corpus);
console.log("Слова после предварительной токенизации:", words);

// 2. Создание базового словаря из символов
function createInitialVocabulary(words) {
  const vocabulary = new Set();
  words.forEach(word => {
      for (const element of word) {
          vocabulary.add(element);
      }
  });
  return Array.from(vocabulary);
}

let vocabulary = new Set(createInitialVocabulary(words));
console.log("Начальный словарь:", vocabulary);

// 3. Функция для подсчета частоты пар символов
function countPairs(words, maxPairLength = 4) {
  const pairs = {};
  words.forEach(word => {
      for (let i = 0; i < word.length; i++) {
          for (let len = 2; len <= maxPairLength && i + len <= word.length; len++) {
              const pair = word.substring(i, i + len);
              pairs[pair] = (pairs[pair] || 0) + 1;
          }
      }
  });
  return pairs;
}

// 4. Функция для нахождения наиболее частой пары
function findMostFrequentPair(pairs) {
  let mostFrequentPair = null;
  let maxCount = 0;
  for (const pair in pairs) {
      if (pairs[pair] > maxCount) {
          maxCount = pairs[pair];
          mostFrequentPair = pair;
      }
  }
  return mostFrequentPair;
}

// 5. Функция для объединения наиболее частой пары в словах
function mergePair(words, pairToMerge, vocabulary) {
  const newWords = [];
  const replacement = pairToMerge ; // Создаем замену (например, "is_")

  words.forEach(word => {
    newWords.push(word.replace(new RegExp(pairToMerge, 'g'), replacement));
  });
  return newWords;
}

// Основной цикл BPE
const numberOfMerges = 25; // Количество итераций объединения
const maxPairLength = 4;   // Максимальная длина пары

for (let i = 0; i < numberOfMerges; i++) {
  let pairs = countPairs(words, maxPairLength);
  let mostFrequentPair = findMostFrequentPair(pairs);
  let foundNewPair = false;

  while (mostFrequentPair && !foundNewPair) {
      const newCombination = mostFrequentPair + "_";

      if (!vocabulary.has(newCombination)) {
          console.log(`Итерация ${i + 1}: Наиболее частая пара:`, mostFrequentPair);

          words = mergePair(words, mostFrequentPair, vocabulary);

          vocabulary.add(newCombination);
          console.log("Обновленный словарь:", Array.from(vocabulary));
          foundNewPair = true;
      } else {
          // Если пара уже в словаре, удаляем ее из pairs и ищем следующую
          delete pairs[mostFrequentPair];
          mostFrequentPair = findMostFrequentPair(pairs);
      }
  }

  if (!foundNewPair) {
      console.log("Нет больше новых пар для объединения.");
      break;
  }
}

vocabulary = Array.from(vocabulary);
console.log("Финальный словарь:", vocabulary);
console.log("Финальные токены:", words);
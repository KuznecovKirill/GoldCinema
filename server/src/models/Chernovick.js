const {NaturalLanguageClient} = require('@google-cloud/language').v1;

async function analyzeText(text) {
  const client = new NaturalLanguageClient();
  const [response] = await client.analyzeEntities({
    document: {
      content: text,
      type: 'PLAIN_TEXT',
    },
  });

  const entities = response.entities;
  const keywords = entities.map(entity => entity.name);
  return keywords;
}

// Пример использования
const filmDescription = 'Описание фильма';
analyzeText(filmDescription).then(keywords => console.log(keywords));
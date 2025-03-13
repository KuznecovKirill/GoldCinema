
  




  //Установка списка популярных фильмов
const setPopularMedia = async (req, res) => {
    //curl GET "http://localhost:8000/medias/popularMovies"
    const topMedias = await swaggerAPI.mediaCollections({
      type: "TOP_POPULAR_MOVIES",
      page: 3,
    });
    console.log(topMedias.items.length);
    const addedMedias = []; // Массив для добавленных медиа
    const errors = [];
    //Promise.all, чтобы дождаться завершения всех асинхронных операций
    await Promise.all(
      topMedias.items.map(async (item) => {
        if (item.nameRu !== null) {
          try {
            //Создание медиа
            let result = await modelMediaCreate(item);
            // Возникла ошибка
            if (result && result.error) {
              if (!result.error.includes("Такое медиа уже существует!")) {
                errors.push(result.error);
              } else {
                // Если фильм уже существует, то его нужно найти в базе данных
                const existingMedia = await modelMedia.findOne({
                  where: { id_media: item.kinopoiskId },
                });
                if (existingMedia) {
                  result = existingMedia;
                  console.log(
                    "Фильм уже существует, поэтому используется текущая запись"
                  );
                }
              }
            }
            if (result && !result.error) {
              console.log("Популярный фильм добавлен!");
              addedMedias.push(result);
            } else {
              console.log("Фильм не был добавлен");
            }
          } catch (error) {
            console.error("Произошла неожиданная ошибка:", error);
            errors.push("Произошла неожиданная ошибка");
          }
        }
      })
    );
    // Добавление в PopularMovie первых 10 добавленных фильмов
    //const popularMoviesToAdd = addedMedias.slice(0, 10);
    try {
      // Получение текущих записей из PopularMovie
      const currentPopularMovies = await modelPopularMovie.findAll();
      const currentIds = currentPopularMovies.map((movie) => movie.id_media);
  
      // Берутся первые 10 id из популярных фильмов для добавления
      const newIds = addedMedias.map((media) => media.id_media).slice(0, 10);
  
      // Остаются только те записи, которые есть в новом списке
      const idsToKeep = currentIds.filter((id) => newIds.includes(id));
  
      // Определяются id, которых ещё нет в текущих записях
      const idsToUpdate = newIds.filter((id) => !idsToKeep.includes(id));
  
      //Обновляются записи, которых нет в newIds
      await Promise.all(
        currentPopularMovies.map(async (media, index) => {
          if (index < idsToUpdate.length) {
            const newId = idsToUpdate[index];
            await media.update({ id_media: newId });
            console.log(`Фильм с id ${media.id_media} обновлен на ${newId}`);
          }
        })
      );
      // Теперь добавляются новые
      await Promise.all(
        idsToAdd.map(async (id) => {
          await modelPopularMovie.create({ id_media: id });
          console.log(`Фильм с id ${id} добавлен в PopularMovie`);
        })
      );
    } catch (error) {
      console.error("Ошибка при добавлении в PopularMovie:", error);
      errors.push("Ошибка при добавлении в PopularMovie");
    }
    if (addedMedias.length == 0) {
      console.log("Ошибки:", errors);
      responseHandler.error(res, "Медиа не добавлены!");
    } else {
      responseHandler.goodrequest(res, addedMedias);
    }
  };
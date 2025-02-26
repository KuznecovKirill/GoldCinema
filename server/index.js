require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const http = require('http');
const routes = require('./src/routes/routes');

const userController = require('./src/controllers/userController');

const mediaController = require('./src/controllers/mediaController');

const favoriteController = require('./src/controllers/favoriteController');

const keywordController = require('./src/controllers/keywordController');

//const PlayGround = require('./src/models/PlayGround');

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

app.use("/goldcinema/v1", routes);

const port = process.env.PORT;
console.log(process.env.PORT);

const server = http.createServer(app);

//Создание коннекта
const connection = mysql.createConnection({
    host: 'MySQL-8.0',
    user: "root",
    database: "Gold_Cinema",
    password: "",
});

app.post('/', (req, res) => {
    res.send('POST запрос на корневом маршруте');
});
// app.post("/signUp", userController.signUp);
// app.post("/user/signIn", userController.signIn); //curl -X POST -H "Content-Type: application/json" -d '{"username": "новичок", "password": "password123"}' http://localhost:8000/signIn
// app.post("/medias", mediaController.getMedias);
// app.post('/genres', mediaController.getGenres);
// app.post('/media/search', mediaController.search);
// app.post('/keyword',keywordController.addInfo);
// app.post('/keyword/search', keywordController.search);
// app.post('/favorites', favoriteController.addFavorite); //curl -X POST -H "Content-Type: application/json" -d '{"id_user": "1", "id_media": "738499"}' http://localhost:8000/favorites

// app.post('/medias', (req, res) => {
//     const page = req.body.page; // Получаем значение page из тела запроса
//     const limit = req.body.limit || 10;
//     const newReq = {
//         query: { page, limit }, // Передаем параметры как query
//         body: req.body,
//     };
//     return mediaController.getMedias(newReq, res);

//     console.log(page);
//     res.send(`Страница: ${page}`);
// });
//Подключение

connection.connect(err => {
    if (err) {
        return console.error('Ошибка подключения: ' + err.message);
    }
    console.log('Подключение к серверу MySQL успешно установлено');
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
    
    server.listen(port, () => {
        console.log(`Сервер слушает порт ${port}`);
    });
});
//PlayGround.getMovies();

//connection.end();



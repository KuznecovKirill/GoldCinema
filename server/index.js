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

const { setupAssociations } = require('./src/models/associations');

//const PlayGround = require('./src/models/PlayGround');

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

app.use("/goldcinema/v1", routes);
///goldcinema/v1

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
//Подключение

connection.connect(err => {
    if (err) {
        return console.error('Ошибка подключения: ' + err.message);
    }
    console.log('Подключение к серверу MySQL успешно установлено');
    setupAssociations();
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
    
    server.listen(port, () => {
        console.log(`Сервер слушает порт ${port}`);
    });
});

//connection.end();



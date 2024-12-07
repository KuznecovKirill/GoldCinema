const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http');

const swaggerUrl = require('./src/swagger/swagger.config');

const modelUser = require('./src/models/modelUser');
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

const port = process.env.PORT
const server = http.createServer(app)

//Создание коннекта
const connection = mysql.createConnection({
    host: 'MySQL-8.0',
    user: "root",
    database: "Gold_Cinema",
    password: "",
});
//Подключение
connection.connect(err => {
    if (err) {
        return console.error('Ошибка подключения: ' + err.message);
    }
    console.log('Подключение к серверу MySQL успешно установлено');
    
    server.listen(port, () => {
        console.log(`Сервер слушает порт ${port}`);
    });
});

//Получение списка популярных фильмов
async function getMovies() {
    let url = swaggerUrl.getUrl('v2.2/', 'films/','collections?type=TOP_POPULAR_ALL&page=1');
    console.log(url);
    const res = await fetch(url, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "X-API-KEY": process.env.KEY,
        },
    });
    const respData = await res.json();
    console.log(respData);

}
getMovies();

connection.end();
//modelUser.createUser();


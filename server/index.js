const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http');
const routes = require("routes");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

const port = process.env.PORT
const server = http.createServer(app)

//Создание коннекта
const conn = mysql.createConnection({
    host: 'MySQL-8.0',
    user: "root",
    database: "GoldCinema",
    password: "",
});
//Подключение
conn.connect(err => {
    if (err) {
        return console.error('Ошибка подключения: ' + err.message);
    }
    console.log('Подключение к серверу MySQL успешно установлено');
    
    server.listen(port, () => {
        console.log(`Сервер слушает порт ${port}`);
    });
});
require('dotenv').config();
import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import http from "http";
import routes from './routes/routes';

import userController from './controllers/userController';

import mediaController from './controllers/mediaController';

import favoriteController from './controllers/favoriteController';

import keywordController from './controllers/keywordController';

import { setupAssociations } from './models/associations';


const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

app.use("/goldcinema/v1", routes);
///goldcinema/v1

const port = process.env.PORT || 8000;
console.log(process.env.PORT);

const server = http.createServer(app);

//Создание коннекта
//TODO: Нужно будет сделать dbConfig перед этим
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

export {app, connection};

//connection.end();



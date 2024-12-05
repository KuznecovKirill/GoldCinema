const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http');

const swaggerUrl = require('./src/swagger/swagger.config');

const User = require('./src/models/modelUser.js')
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
// const sql = `create table if not exists users(
//     id int primary key auto_increment,
//     name varchar(255) not null,
//     age int not null
//   )`;
// connection.query(sql, function(err, results) {
//     if(err) console.log(err);
//     else console.log("Таблица создана");
// });
// connection.end();

// const createUser = async () => {
//     const newUser = await User.create({
//         username: "tom",
//         displayName: "Tom",
//         password: "password",
//         salt: "salt"
        
//     });
//     console.log('Пользователь создан:', newUser.toJSON());
//     newUser.setPassword("my_password");
   
//     await newUser.save();

//     // const newUser = User.build({
//     //     username: 'john_doe',
//     //     displayName: 'John Doe',
//     //     password: 'securepassword',
//     //     salt: 'randomsalt'
//     // });
    
// }

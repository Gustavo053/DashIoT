const mongoose = require('mongoose');
const Read = require('../models/ReadSchema');
const { ipcMain } = require('electron');
let addresToDatabase = '';

//listenner do canal addres-to-database
//recebe o endereço do banco de dados, caso tenha sido enviado pelo usuário
ipcMain.on('addres-to-database', (event, data) => {
    console.log('entrei no addres');
    addresToDatabase = data;
});

//conexão com o bando de dados
mongoose.connect('mongodb://localhost/readings', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('conectado ao banco');
}).catch((err) => {
    console.log(err);
});

ipcMain.on('data-persistence', (event, data) => {
});
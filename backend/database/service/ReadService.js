const mongoose = require('mongoose');
const ReadSchema = require('../models/ReadSchema');
const { ipcMain } = require('electron');

//conexão com o bando de dados
mongoose.connect('mongodb://localhost/readings', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('conectado ao banco');
}).catch((err) => {
    console.log(err);
});

//listenner do canal data-persistence
//recebe os dados enviados do frontend e envia para a camada de serviço
ipcMain.on('data-persistence', (event, data) => {
});
const mongoose = require('mongoose');

//Cria o Schema(como se fosse a tabela) da leitura
const readSchema = mongoose.Schema({
    data: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('readings', readSchema);
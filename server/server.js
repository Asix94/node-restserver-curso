require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

const bodyParser = require('body-parser');

//parse aplication/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse aplicación json
app.use(bodyParser.json());

// habilitar la carpeta public public 
app.use(express.static(path.resolve(__dirname, '../public')));

// Configuración global de rutas
app.use(require('./routes/index'))

mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: true }, (err, res) => {

    if (err) throw err;

    console.log('Base de datos ONLINE');
})

app.listen(process.env.PORT, () => console.log(`Escuchando puerto ${process.env.PORT}`));
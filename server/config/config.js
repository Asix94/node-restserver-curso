//============================
// Puerto
//============================
process.env.PORT = process.env.PORT || 3000;

//============================
// Entorno
//============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

//============================
// Base de datos
//============================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb://asix94:qVt466xx020GHt0n@ds155916.mlab.com:55916/cafe';
}

process.env.URLDB = urlDB;
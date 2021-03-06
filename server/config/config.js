// ==============================
//Puerto
// ===============================

process.env.PORT = process.env.PORT || 3000;


// ========================================
// Entorno
// ========================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';



// =======================================
// Base de datos
// =======================================

let urlDB;
/* 
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb://<cafe-user>:<Ferne123>@ds157742.mlab.com:57742/cafe'
} */
urlDB = 'mongodb://<fer>:<f123456>@ds157742.mlab.com:57742/cafe'
process.env.URLDB = urlDB;
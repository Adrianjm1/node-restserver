// ++++++++++++++++
// PUERTO
// ++++++++++++++

process.env.PORT = process.env.PORT || 3000;


process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// FECHA DE EXPIRACION
//60 SEG * 60 MIN * 24 HES * 30 D
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;


//SEED DE AUTENTICACION

process.env.SEED = process.env.SEED || 'desarrollo';


//BDD

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';

} else {
    urlDB = 'mongodb+srv://adrian2001:adrian2001@cluster0.y6zpr.mongodb.net/cluster0?retryWrites=true&w=majority'

}

process.env.URLDB = urlDB;
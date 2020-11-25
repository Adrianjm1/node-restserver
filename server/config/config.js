// ++++++++++++++++
// PUERTO
// ++++++++++++++

process.env.PORT = process.env.PORT || 3000;


process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// FECHA DE EXPIRACION
//60 SEG * 60 MIN * 24 HES * 30 D
process.env.CADUCIDAD_TOKEN = '48h';


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


//GOOGLE CLIENT ID
//------------------

process.env.CLIENT_ID = process.env.CLIENT_ID || "836633056698-p6el68jc1o5d1fb237k8bv8o6i6m2gae.apps.googleusercontent.com";
const jwt = require('jsonwebtoken');



//----------
// Vericiar token
//-----------

let verificaToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: "El token no es valido"
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
    })



};

//VERIFICA ADMIN ROLE

let verificaAdmin = (req, res, next) => {
    let usuario = req.usuario
    if (usuario.role === "ADMIN_ROLES") {

        next();

    } else {
        return res.json({
            ok: true,
            err: {
                message: "No eres un administrados"
            }
        })
    }




}

module.exports = {
    verificaToken,
    verificaAdmin
};
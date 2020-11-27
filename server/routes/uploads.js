const express = require('express');
const fileUpload = require('express-fileupload');
const usuario = require('../models/usuario');
const app = express();
const fs = require('fs');
const path = require('path');

const Producto = require('../models/producto');
const Usuario = require('../models/usuario');



app.use(fileUpload());

app.put('/uploads/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;




    if (!req.files) {

        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningun archivo'
            }
        });


    }

    //VALIDAR TIPO

    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: "Los tipos pemitidas son" + tiposValidos.join(', ')
            }
        })
    }

    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];

    // EXTENsIONES PERMITIDAS

    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'las extensiones permitidsa son ' + extensionesValidas.join(', '),
                ext: extension
            }
        })
    }

    //CAMBIAR NAME AL ARCHIVO

    let nombreArchivo = `${id}-${ new Date().getMilliseconds()}.${extension}`



    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {

        if (err) {

            return res.status(500).json({
                ok: false,
                err
            })
        }

        //SE CARGO LA IMAGEN
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo);
        }



    })

});

function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioDB) => {

        if (err) {

            borraArchivo(nombreArchivo, 'usuarios');

            return res.status(500).json({
                ok: false,
                err
            })
        }


        if (!usuarioDB) {


            borraArchivo(nombreArchivo, 'usuarios');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'usuario inexistente'
                }
            })
        }

        borraArchivo(usuarioDB.img, 'usuarios')
        usuarioDB.img = nombreArchivo;


        usuarioDB.save((err, usuarioDN) => {

            res.json({
                ok: true,
                usuario: usuarioDB,
                img: nombreArchivo
            })

        })


    })


}

function imagenProducto(id, res, nombreArchivo) {

    Producto.findById(id, (err, productoDB) => {

        if (err) {

            borraArchivo(nombreArchivo, 'productos');

            return res.status(500).json({
                ok: false,
                err
            })
        }


        if (!productoDB) {


            borraArchivo(nombreArchivo, 'productos');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'producto inexistente'
                }
            })
        }

        borraArchivo(productoDB.img, 'productos')
        productoDB.img = nombreArchivo;


        productoDB.save((err, productoDB) => {

            res.json({
                ok: true,
                producto: productoDB,
                img: nombreArchivo
            })

        })


    })


}


function borraArchivo(nombreImg, tipo) {

    let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${ nombreImg}`);


    if (fs.existsSync(pathImg)) {

        fs.unlinkSync(pathImg);
    }



}

module.exports = app;
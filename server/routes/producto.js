const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');


// OBTENER TODOS LOS PRODUCTOS


app.get('/producto', verificaToken, (req, res) => {
    //trae todos los productos
    //populate usuario categoria
    //paginado

    let desde = req.query.desde || 0;

    desde = Number(desde);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            })

        })


});


app.get('/producto/:id', verificaToken, (req, res) => {
    //populate usuario categoria
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'el id no es correcto'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            })


        })






})


//BUSCAR PRODUCTOS

app.get('/producto/buscar/:termino', verificaToken, (req, res) => {


    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');



    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {


            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }


            res.json({
                ok: true,
                productos
            })


        })



})








app.post('/producto', verificaToken, (req, res) => {
    //grabar el usuarui
    //grabar una categoria
    let body = req.body;

    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,

    });

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }




        res.status(201).json({
            ok: true,
            producto: productoDB

        })

    });





});

app.put('/producto/:id', verificaToken, (req, res) => {
    //actualizar
    let id = req.params.id;

    let body = req.body;


    Producto.findByIdAndUpdate(id, {
        new: true,
        runValidators: true
    }, (err, productoDB) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "el id no existe"
                }
            })
        }

        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                producto: productoGuardado
            })

        })


        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;

        res.json({
            ok: true,
            producto: productoDB
        })
    })



});

app.delete('/producto/:id', verificaToken, (req, res) => {
    //borrar
    let id = req.params.id;


    Producto.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        productoDB.disponible = false;

        productoDB.save((err, productoBorrado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoBorrado,
                mensaje: 'Producto borradox'
            });


        })


    });


});



module.exports = app;
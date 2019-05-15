const express = require('express');
const { verificaToken } = require('../middlewares/authentication');

let app = express();
let Producto = require('../models/producto');


// =============================
// Obtener todos los productos
// =============================
app.get('/productos', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            Producto.countDocuments((err, conteo) => {

                res.status(201).json({
                    ok: true,
                    productos,
                    cuantos: conteo
                });

            });

        });

})

// =============================
// Obtener todos los productos
// =============================
app.get('/productos/:id', verificaToken, (req, res) => {

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
                return res.status(404).json({
                    ok: false,
                    err: {
                        message: 'El ID no es correcto'
                    }
                })
            }

            res.status(201).json({
                ok: true,
                producto: productoDB
            })
        })
});

// =============================
// Buscar productos
// =============================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i')

    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                productos
            })
        });
});

// =============================
// Crear un nuevo producto
// =============================
app.post('/productos', verificaToken, (req, res) => {

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(404).json({
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

// =============================
// Actualizar un producto
// =============================
app.put('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id
    let body = req.body

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            })
        }

        res.status(201).json({
            ok: true,
            producto: productoDB,
        })

    });
});

// =============================
// Borrar un producto
// =============================
app.delete('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let cambiaestado = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, cambiaestado, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB,
            message: 'Producto borrado'
        });
    });

});

module.exports = app;
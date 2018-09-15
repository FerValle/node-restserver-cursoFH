const express = require('express');

const bcrypt = require('bcrypt');

const _ = require('underscore');

const Usuario = require('../models/usuario');

const app = express();


app.get('/usuario', function(req, res) {

    // En el query puede venir desde. Si no viene nada quiero 0
    let desde = req.query.desde || 0
    desde = Number(desde);

    let limite = req.query.limite || 10
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre email role estado google img')
        //   .skip(5)
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    conteo

                });
            });

        })

});

app.post('/usuario', function(req, res) {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        // bcrypt.hashSync(string a encriptar , nuero de vueltas que quiero aplicarle al hash),
        password: bcrypt.hashSync(body.password, 10),
        //img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //    usuarioDB.password = null;

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

});

app.put('/usuario/:id', function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    })


});

app.delete('/usuario/:id', function(req, res) {

    //       Eliminacion fisica
    //      ####################
    /*
        let id = req.params.id;

        
            Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                };

                if (!usuarioBorrado) {
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: 'Usuario no encontrado'
                        }
                    });
                };

                res.json({
                    ok: true,
                    usuario: usuarioBorrado
                });

            });

        */

    //      Eliminacion cambiando el estado
    // ##########################################

    let id = req.params.id;

    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

    let cambiaEstado = {
        estado: false
    };

    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });

    });


});

module.exports = app;
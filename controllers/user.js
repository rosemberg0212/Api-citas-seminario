const {response} = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');

const usuariosGet = async (req, res = response)=>{

    // const {limite = 10, desde = 0} = req.query;

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments({estado: true}),
        Usuario.find({estado: true})
            // .skip(Number(desde))
            // .limit(Number(limite))
    ]);

    res.json({
        total,
        usuarios
    });
}

const usuarioGetById = async (req, res)=>{
    const {id} = req.params;
    const usuario = await Usuario.findById(id);

    f(!usuario.estado)
    {
        return res.status(400).json({
            msg:'comentario no existe'
        })
    }

    res.json({
        usuario
    });
}

const usuariosPut = async (req, res = response)=>{

    const {id} = req.params;
    const {_id,password, google, ...resto} = req.body

    //Todo validar contra BD
    if(password){
        //Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto)

    res.json({
        usuario
    });
}

const usuariosPost = async (req, res = response)=>{


    const {nombre, correo, password, rol, celular} = req.body;
    const usuario = new Usuario({nombre, correo, password, rol, celular});

    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    //Guardar usuario
    await usuario.save();

    //Generar JWT
	const token = await generarJWT(usuario.id)

    res.json({
        usuario,
        token
    });
}

const usuariosDelete = async (req, res = response)=>{

    const {id} = req.params; 

    //borrar fisicamente
    //const usuario = await Usuario.findByIdAndDelete(id);

    const usuario = await Usuario.findByIdAndUpdate(id, {estado:false})

    res.json({
        usuario
    });
}

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuarioGetById
}
import express from "express"
import {conectarDB, Usuario} from "./database.js"

const app = express()
const port = 3000

app.use(express.json())

// conectar a mongodb
conectarDB()

app.get('/', (req, res) => {
    res.status(200).json({
        msg: 'Bienvenido a TaDa.',
        description: "Para acceder a todas nuestras promociones, regístrate y descubre todo lo que tenemos para ti."
    })
})

// Registro de usuarios
app.post('/register', async (req, res) => {

    try {

        const {imagen, nombre, apellido, direccion, celular, correo, password, fechaNacimiento} = req.body

        // validar campos vacios
        if (!imagen || !nombre || !apellido || !direccion || !celular || !correo || !password) {
            return res.status(400).json({
                msg: "Lo sentimos, debes llenar todos los campos"
            })
        }

        // validar correo repetido
        const usuarioExiste = await Usuario.findOne({correo})

        if (usuarioExiste) {
            return res.status(400).json({
                msg: "El correo ya se encuentra registrado"
            })
        }

        // validar contraseña
        if (password.length <= 8 || !password.includes('$')) {
            return res.status(400).json({
                msg: "La contraseña debe tener más de 8 caracteres y contener el carácter especial $"
            })
        }

        // validar celular
        if (!/^\d{10}$/.test(celular)) {
            return res.status(400).json({
                msg: "El celular debe contener exactamente 10 dígitos"
            })
        }

        // registrar usuario
        const nuevoUsuario = new Usuario({
            imagen,
            nombre,
            apellido,
            direccion,
            celular,
            correo,
            password,
            fechaNacimiento
        })

        await nuevoUsuario.save()

        res.status(201).json({
            msg: "Usuario registrado correctamente"
        })

    } catch (error) {

        res.status(500).json({
            msg: "Error al registrar usuario"
        })

    }

})

// Middleware
const verificarToken = (req, res, next) => {

    const token = req.headers.token

    if (!token) {
        return res.status(404).json({
            msg: "Token no proporcionado"
        })
    }

    if (token !== "abcd5743") {
        return res.status(401).json({
            msg: "Acceso denegado"
        })
    }

    next()
}

// Ruta protegida
app.get("/promo-tada", verificarToken, (req, res) => {
    res.status(200).json({
        msg: "Aplica a los siguientes cupones de descuento"
    })
})

app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`)
})
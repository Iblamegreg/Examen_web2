import mongoose from "mongoose"

const conectarDB = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/tada")
        console.log("MongoDB conectado correctamente")

    } catch (error) {
        console.log("Error al conectar MongoDB:", error)
    }
}

const usuarioSchema = new mongoose.Schema({
    imagen: String,
    nombre: String,
    apellido: String,
    direccion: String,
    celular: String,
    correo: String,
    password: String,
    fechaNacimiento: {
        type: Date,
        default: Date.now
    }
})

const Usuario = mongoose.model("Usuario", usuarioSchema)

export {conectarDB, Usuario}
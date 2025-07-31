import jwt from "jsonwebtoken";
import "dotenv/config";
import User from '../models/User.js';
const secrety= process.env.JWT_KEY

    export const validarJWT = async (req, res, next) => {
    const token = req.header("pandeyuca");

    if (!token) {
        return res.status(401).json({
            msg: "No hay token en la petición."
        });
    }
    try {
        const { uid } = jwt.verify(token, secrety);

        let user =await User.findById(uid);

        if (!user){
            return res.status(401).json({
                msg: "Invalid token" //- usuario no existe DB
            })
        }

        if (user.isActive == false) {
            return res.status(401).json({
                msg: "Invalid token" //- usuario con estado: false
            })
        }
        //Crucial: Adjuntar el objeto de usuario a la solicitud
        req.user = user;
        next();
        console.log('valido')
    } catch (error) {
        console.error("Error en validarJWT:", error);
        res.status(401).json({
            msg: "Token no válido."
        });
    }
} 
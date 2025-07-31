import bcryptjs from "bcryptjs";
import User from "../models/User.js";
import { generarJWT } from "../middlewares/generar-jwt.js";

const AuthenticationController = {

    createAuthentication: async (req, res) => {
        try {
            const {
                firstName,
                lastName,
                email,
                phone,
                password
            } = req.body; 

            if ( !firstName || !lastName || !phone || !email || !password) {
                return res.status(400).json({
                    success: false,
                    error: 'All required fields must be provided.'
                });
            }
                const salt= await bcryptjs.genSalt(1);
            const newUser = new User({ 
                firstName,
                lastName,
                phone,
                email,
                globalRole: 'Admin',
                isActive: true,
                isEmailVerified: true,
                password_hash: bcryptjs.hashSync(password, salt) // Pasa la contraseña en texto plano 
            });
            //guardar en a base de datos
            const savedUser = await newUser.save();
            console.log(newUser);
            const userResponse = savedUser.toObject(); // Convierte el documento Mongoose a un objeto JS
            delete userResponse.password_hash;
            res.status(200).json({
                success: true,
                message: 'User created successfully.',
                data: userResponse // El usuario recién creado (sin contraseña_hash)
            });
        } catch (error) {
            if (error.code === 11000) { // Código de error de duplicado en MongoDB
                const field = Object.keys(error.keyValue)[0]; // Obtiene el nombre del campo duplicado
                return res.status(400).json({
                    success: false,
                    error: `There is already a user with this ${field}.`
                });
            }
            console.log(error)
            res.status(500).json({
                success: false,
                error: 'Server error creating user -m.'
            });         
        }
    },
    Login: async (req, res) => {
        try {
            
            const {
                email,
                password
            } = req.body;


            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    error: 'All required fields must be provided.'
                });
            }
            
            const holder = await User.findOne({ email }).select('+password_hash');  //traer datos del correo.//       
            console.log("User found:", holder)

            if(!holder){
                return res.status(400).json({
                success: false,
                message: 'Invalid credentials (incorrect email or password)'
            });
            }


            /* const salt= await bcryptjs.genSalt(1);
            const hash= bcryptjs.hashSync(password, salt);
            console.log(salt);
 */         
            const isPasswordValid = await comparePassword(password,holder.password_hash);

            async function  comparePassword(plainTextPassword, hashedPassword) {
                    try {
                        const match = await bcryptjs.compare(plainTextPassword, hashedPassword);
                        return match
                    } catch (error) {
                        console.log(error)
                        return false
                    }
            }
            
            if(!isPasswordValid){
                return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            });
            }//teatetronaetris1411
            const token = await generarJWT(holder.id) 
            console.log(token)
            res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            holder: {
                _id: holder._id,
                firstName: holder.firstName,
                email: holder.email,
                globalRole: holder.globalRole
            }
        });
        } catch (error) {  
            res.status(500).json({
                success: false,
                error: 'Server error validating user -m.'
            });
        }
    }
}

export default AuthenticationController;
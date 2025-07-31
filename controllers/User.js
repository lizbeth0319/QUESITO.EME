import User from '../models/User.js'; 

// Obtener y devolver la lista de todos los usuarios registrados.
export const getUsers = async (req, res) => {
    try {
        const users = await User.find(); 

        res.status(200).json({
            success: true,
            message: 'Lista de usuarios obtenida exitosamente.',
            data: users
        });
    } catch (error) {
        console.error("Error en getUsers:", error); 
        res.status(500).json({
            success: false,
            message: 'Error en el servidor al obtener la lista de usuarios.'
        });
    }
};


// Obtener el perfil del usuario que está actualmente autenticado.
//  El ID del usuario se extrae del JWT a través del middleware `validarJWT`
//        y se adjunta a `req.user`.
export const getUserProfile = async (req, res) => {
    try {
        // `req.user` contiene el documento del usuario completo, proporcionado por `validarJWT`.
        const user = req.user;
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Perfil de usuario no encontrado. El token podría ser inválido o el usuario no existe.'
            });
        }
        const userResponse = user.toObject();
        delete userResponse.password_hash;

        res.status(200).json({
            success: true,
            message: 'Perfil de usuario obtenido exitosamente.',
            data: userResponse
        });

    } catch (error) {
        console.error("Error en getUserProfile:", error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor al obtener el perfil.'
        });
    }
};

//  Actualizar el perfil del usuario actualmente autenticado.
export const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado para actualizar.'
            });
        }

        const userResponse = user.toObject();
        delete userResponse.password_hash; // Elimina el hash

        res.status(200).json({
            success: true,
            message: 'Perfil de usuario actualizado exitosamente.',
            data: userResponse
        });

    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);//mongo
            return res.status(400).json({
                success: false,
                message: 'Errores de validación al actualizar el perfil.',
                errors: errors
            });
        }
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return res.status(400).json({
                success: false,
                message: `Ya existe un usuario con este ${field}.`
            });
        }
        console.error("Error en updateUserProfile:", error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor al actualizar el perfil.'
        });
    }
};


//Eliminar un usuario específico por su ID.
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado para eliminar.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Usuario eliminado exitosamente.',
            data: { _id: user._id } //  id e  eliminado
        });
    } catch (error) {
        console.error("Error en deleteUser:", error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor al eliminar el usuario.'
        });
    }
};

// Objetivo: Cambiar el rol (globalRole) de un usuario específico.
export const updateUserRole = async (req, res) => {
    try {
        const { globalRole } = req.body;
        if (!globalRole) {
            return res.status(400).json({
                success: false,
                message: 'Se requiere proporcionar un nuevo rol (globalRole).'
            });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { globalRole },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado para actualizar el rol.'
            });
        }

        const userResponse = user.toObject();
        delete userResponse.password_hash;

        res.status(200).json({
            success: true,
            message: `Rol del usuario ${user.email} actualizado exitosamente a '${user.globalRole}'.`,
            data: userResponse
        });

    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Errores de validación al actualizar el rol.',
                errors: errors
            });
        }
        console.error("Error en updateUserRole:", error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor al actualizar el rol del usuario.'
        });
    }
};

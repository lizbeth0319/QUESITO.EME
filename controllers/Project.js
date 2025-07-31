import Project from '../models/project.js'; 
import User from '../models/User.js';    

//  Obtener y devolver la lista de todos los proyectos activos.
export const getProjects = async (req, res) => {
    try {
        // Podrías añadir lógica para filtrar proyectos por el usuario autenticado
        // const projects = await Project.find({ isActive: true, 'members.user': req.user._id });
        const projects = await Project.find({ isActive: true });

        res.status(200).json({
            success: true,
            message: 'Lista de proyectos obtenida exitosamente.',
            data: projects
        });
    } catch (error) {
        console.error("Error en getProjects:", error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor al obtener la lista de proyectos.'
        });
    }
};

//  Obtener los detalles de un proyecto específico por su ID.
export const getProjectById = async (req, res) => {
    try {
        const { id } = req.params;

        // Opcional: Validar si el ID es un ObjectId de Mongoose válido
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: 'ID de proyecto inválido.'
            });
        }

        const project = await Project.findById(id).populate('createdBy', 'firstName lastName email').populate('members.user', 'firstName lastName email'); // Popular si tienes referencias a usuarios

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Proyecto no encontrado.'
            });
        }

        // Opcional: Si solo los miembros o el creador pueden ver el proyecto
        // if (String(project.createdBy) !== String(req.user._id) && !project.members.some(m => String(m.user) === String(req.user._id)) && req.user.globalRole !== 'Admin') {
        //     return res.status(403).json({
        //         success: false,
        //         message: 'No tienes permiso para ver este proyecto.'
        //     });
        // }

        res.status(200).json({
            success: true,
            message: 'Detalles del proyecto obtenidos exitosamente.',
            data: project
        });
    } catch (error) {
        console.error("Error en getProjectById:", error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor al obtener el proyecto.'
        });
    }
};

// POST /api/projects
// Objetivo: Crear un nuevo proyecto.
// Acceso: Solo para usuarios autorizados (Admin, ProjectManager, etc.).
export const createProject = async (req, res) => {
    try {
        const { name, description, category, startDate, endDate, status, members } = req.body;
        const createdBy = req.user._id; // El ID del usuario que crea el proyecto (del JWT)

        // 1. Validación de campos obligatorios
        if (!name || !description || !category || !startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: 'Los campos nombre, descripción, categoría, fecha de inicio y fecha de fin son obligatorios.'
            });
        }

        // 2. Opcional: Verificar si el nombre del proyecto ya existe (si es único)
        const existingProject = await Project.findOne({ name });
        if (existingProject) {
            return res.status(400).json({
                success: false,
                message: `Ya existe un proyecto con el nombre '${name}'.`
            });
        }

        // 3. Crear una nueva instancia de proyecto
        const newProject = new Project({
            name,
            description,
            category,
            startDate,
            endDate,
            status: status || 'Pending', // Estado por defecto
            createdBy,
            isActive: true, // Por defecto
            members: [{ user: createdBy, role: 'Owner' }], // El creador es el primer miembro y propietario
            ...members && { members } // Si se envían miembros adicionales en el body
        });

        // 4. Guardar el proyecto en la base de datos
        const savedProject = await newProject.save();

        res.status(201).json({
            success: true,
            message: 'Proyecto creado exitosamente.',
            data: savedProject
        });

    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return res.status(400).json({
                success: false,
                message: `Ya existe un proyecto con este ${field}.`
            });
        }
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Errores de validación al crear el proyecto:',
                errors: errors
            });
        }
        console.error("Error en createProject:", error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor al crear el proyecto.'
        });
    }
};

// POST /api/projects/:id/members
// Objetivo: Añadir un miembro a un proyecto existente.
// Acceso: Solo para usuarios autorizados (Admin, ProjectManager, etc.).
export const addProjectMember = async (req, res) => {
    try {
        const { id: projectId } = req.params;
        const { userId, role } = req.body; // userId del nuevo miembro, y su rol en el proyecto

        // Validaciones básicas
        if (!userId || !role) {
            return res.status(400).json({
                success: false,
                message: 'Se requiere el ID del usuario y el rol para añadir un miembro.'
            });
        }
        if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: 'ID de usuario inválido.'
            });
        }

        // Buscar el proyecto
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Proyecto no encontrado.'
            });
        }

        // Verificar si el usuario ya es miembro
        if (project.members.some(member => String(member.user) === userId)) {
            return res.status(400).json({
                success: false,
                message: 'El usuario ya es miembro de este proyecto.'
            });
        }

        // Verificar si el userId existe en la base de datos de usuarios
        const userToAdd = await User.findById(userId);
        if (!userToAdd) {
            return res.status(404).json({
                success: false,
                message: 'El usuario a añadir no fue encontrado.'
            });
        }

        // Añadir el nuevo miembro
        project.members.push({ user: userId, role });
        await project.save(); // Guarda los cambios en el proyecto

        // Opcional: Popula el campo 'user' para la respuesta
        const populatedProject = await Project.findById(projectId).populate('members.user', 'firstName lastName email');

        res.status(200).json({
            success: true,
            message: `Miembro añadido exitosamente al proyecto '${project.name}'.`,
            data: populatedProject.members // Puedes devolver solo la lista de miembros actualizada
        });

    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Errores de validación al añadir miembro:',
                errors: errors
            });
        }
        console.error("Error en addProjectMember:", error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor al añadir miembro al proyecto.'
        });
    }
};


// PUT /api/projects/:id
// Objetivo: Actualizar los detalles de un proyecto existente por su ID.
// Acceso: Solo para usuarios autorizados (Admin, ProjectManager, etc.).
export const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Opcional: Validar si el ID es un ObjectId de Mongoose válido
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: 'ID de proyecto inválido.'
            });
        }
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Se requieren datos para actualizar el proyecto.'
            });
        }

        // Considerar no permitir la actualización del campo `createdBy` a través de esta ruta
        delete updateData.createdBy;

        // Si se permite actualizar la lista de miembros desde aquí, asegúrate de que el esquema lo maneje.
        // Si no, también podrías eliminar `updateData.members;`

        const project = await Project.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true } // `new: true` devuelve el doc actualizado, `runValidators: true` ejecuta validaciones
        ).populate('createdBy', 'firstName lastName email').populate('members.user', 'firstName lastName email'); // Popular para la respuesta

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Proyecto no encontrado para actualizar.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Proyecto actualizado exitosamente.',
            data: project
        });

    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Errores de validación al actualizar el proyecto:',
                errors: errors
            });
        }
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return res.status(400).json({
                success: false,
                message: `Ya existe un proyecto con este ${field}.`
            });
        }
        console.error("Error en updateProject:", error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor al actualizar el proyecto.'
        });
    }
};

// PUT /api/projects/:id/status
// Objetivo: Actualizar solo el estado de un proyecto específico.
// Acceso: Solo para usuarios autorizados (Admin, ProjectManager, etc.).
export const updateProjectStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // Solo esperamos el campo 'status'

        // 1. Validar el ID del proyecto
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: 'ID de proyecto inválido.'
            });
        }

        // 2. Validar que el nuevo estado se proporcione y sea válido (opcional, si tienes una lista de estados permitidos)
        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'El campo "status" es obligatorio para actualizar el estado del proyecto.'
            });
        }
        // Ejemplo de validación de estados permitidos
        const allowedStatuses = ['Pending', 'InProgress', 'Completed', 'Cancelled'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Estado inválido. Los estados permitidos son: ${allowedStatuses.join(', ')}.`
            });
        }

        // 3. Buscar y actualizar el estado del proyecto
        const project = await Project.findByIdAndUpdate(
            id,
            { status }, // Solo actualizamos el campo status
            { new: true, runValidators: true }
        ).populate('createdBy', 'firstName lastName email'); // Popular para la respuesta

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Proyecto no encontrado para actualizar el estado.'
            });
        }

        res.status(200).json({
            success: true,
            message: `Estado del proyecto '${project.name}' actualizado a '${project.status}'.`,
            data: project
        });

    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Errores de validación al actualizar el estado del proyecto:',
                errors: errors
            });
        }
        console.error("Error en updateProjectStatus:", error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor al actualizar el estado del proyecto.'
        });
    }
};

// DELETE /api/projects/:id
// Objetivo: Eliminar un proyecto por su ID.
// Acceso: Solo para usuarios con rol de 'Admin'.
export const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;

        // Opcional: Validar si el ID es un ObjectId de Mongoose válido
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: 'ID de proyecto inválido.'
            });
        }

        const project = await Project.findByIdAndDelete(id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Proyecto no encontrado para eliminar.'
            });
        }

        res.status(200).json({
            success: true,
            message: `Proyecto '${project.name}' eliminado exitosamente.`,
            data: { _id: project._id }
        });
    } catch (error) {
        console.error("Error en deleteProject:", error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor al eliminar el proyecto.'
        });
    }
};

// DELETE /api/projects/:id/members/:userId
// Objetivo: Eliminar un miembro de un proyecto específico.
// Acceso: Solo para usuarios autorizados (Admin, ProjectManager, etc.).
export const removeProjectMember = async (req, res) => {
    try {
        const { id: projectId, userId } = req.params;

        // Validaciones básicas de IDs
        if (!projectId.match(/^[0-9a-fA-F]{24}$/) || !userId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: 'IDs de proyecto o usuario inválidos.'
            });
        }

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Proyecto no encontrado.'
            });
        }

        // Filtra la lista de miembros para eliminar al usuario con el userId dado
        const initialMemberCount = project.members.length;
        project.members = project.members.filter(member => String(member.user) !== userId);

        if (project.members.length === initialMemberCount) {
            return res.status(404).json({
                success: false,
                message: 'El usuario especificado no es miembro de este proyecto.'
            });
        }

        await project.save(); // Guarda los cambios en el proyecto

        // Opcional: Popula el campo 'user' para la respuesta
        const populatedProject = await Project.findById(projectId).populate('members.user', 'firstName lastName email');


        res.status(200).json({
            success: true,
            message: `Miembro eliminado exitosamente del proyecto '${project.name}'.`,
            data: populatedProject.members // Puedes devolver la lista de miembros actualizada
        });

    } catch (error) {
        console.error("Error en removeProjectMember:", error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor al eliminar miembro del proyecto.'
        });
    }
};
import Comment from '../models/Comment.js'; // Asegúrate de que esta ruta a tu modelo sea correcta
import Project from '../models/Project.js'; // Necesario para verificar si el proyecto existe
import Task from '../models/Tasks.js';     // Necesario para verificar si la tarea existe
import User from '../models/User.js';     // Necesario para popular la información del autor

//  Crear un comentario en un proyecto.
export const createComment = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { content } = req.body;
        const author = req.user._id; 

        // 1. Validar el ID del proyecto
        if (!projectId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: 'ID de proyecto inválido.'
            });
        }

        // 2. Verificar que el proyecto exista
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Proyecto no encontrado.'
            });
        }

        // 3. Validar el contenido del comentario
        if (!content || content.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'El contenido del comentario es obligatorio.'
            });
        }

        const newComment = new Comment({
            content,
            project: projectId, // Referencia al proyecto
            author,             // Referencia al autor
            // task: null,      // No hay tarea para un comentario de proyecto
            isActive: true,     // Por defecto
        });

        const savedComment = await newComment.save();

        // Opcional: Popular el autor para la respuesta
        const populatedComment = await Comment.findById(savedComment._id).populate('author', 'firstName lastName email');

        res.status(201).json({
            success: true,
            message: 'Comentario en proyecto creado exitosamente.',
            data: populatedComment
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Errores de validación al crear el comentario:',
                errors: errors
            });
        }
        console.error("Error en createComment (Proyecto):", error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor al crear el comentario en el proyecto.'
        });
    }
};

//  Crear un comentario en una tarea específica.
export const createCommentOnTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { content } = req.body;
        const author = req.user._id;

        // 1. Validar el ID de la tarea
        if (!taskId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: 'ID de tarea inválido.'
            });
        }

        // 2. Verificar que la tarea exista
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Tarea no encontrada.'
            });
        }

        // 3. Validar el contenido del comentario
        if (!content || content.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'El contenido del comentario es obligatorio.'
            });
        };

        const newComment = new Comment({
            content,
            task: taskId,       // Referencia a la tarea
            project: task.project, // Copiar el project ID de la tarea para facilitar búsquedas o validaciones
            author,             // Referencia al autor
            isActive: true,
        });

        const savedComment = await newComment.save();

        const populatedComment = await Comment.findById(savedComment._id).populate('author', 'firstName lastName email');

        res.status(201).json({
            success: true,
            message: 'Comentario en tarea creado exitosamente.',
            data: populatedComment
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Errores de validación al crear el comentario en la tarea:',
                errors: errors
            });
        }
        console.error("Error en createCommentOnTask:", error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor al crear el comentario en la tarea.'
        });
    }
};

//  Obtener comentarios de un proyecto.
export const getCommentsByProject = async (req, res) => {
    try {
        const { projectId } = req.params;

        if (!projectId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: 'ID de proyecto inválido.'
            });
        }

        // Opcional: Verificar que el proyecto exista y que el usuario tenga acceso a él.
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ success: false, message: 'Proyecto no encontrado.' });
        }
        // if (!project.members.some(m => String(m.user) === String(req.user._id)) && req.user.globalRole !== 'Admin') {
        //     return res.status(403).json({ success: false, message: 'No tienes permiso para ver los comentarios de este proyecto.' });
        // }

        const comments = await Comment.find({ project: projectId, task: { $exists: false }, isActive: true }) // Solo comentarios de proyecto
                                    .populate('author', 'firstName lastName email'); // Popula el autor

        res.status(200).json({
            success: true,
            message: 'Comentarios del proyecto obtenidos exitosamente.',
            data: comments
        });
    } catch (error) {
        console.error("Error en getCommentsByProject:", error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor al obtener los comentarios del proyecto.'
        });
    }
};

//  Obtener comentarios de una tarea.
export const getCommentsByTask = async (req, res) => {
    try {
        const { taskId } = req.params;

        if (!taskId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: 'ID de tarea inválido.'
            });
        }
        // Opcional: Verificar que la tarea exista y que el usuario tenga acceso a ella (a través del proyecto).
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ success: false, message: 'Tarea no encontrada.' });
        }
        // const project = await Project.findById(task.project);
        // if (!project.members.some(m => String(m.user) === String(req.user._id)) && req.user.globalRole !== 'Admin') {
        //     return res.status(403).json({ success: false, message: 'No tienes permiso para ver los comentarios de esta tarea.' });
        // }


        const comments = await Comment.find({ task: taskId, isActive: true })
                                    .populate('author', 'firstName lastName email');

        res.status(200).json({
            success: true,
            message: 'Comentarios de la tarea obtenidos exitosamente.',
            data: comments
        });
    } catch (error) {
        console.error("Error en getCommentsByTask:", error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor al obtener los comentarios de la tarea.'
        });
    }
};

//  Actualizar un comentario.
export const updateComment = async (req, res) => {
    try {
        const { id } = req.params; // ID del comentario
        const { content } = req.body;
        const userId = req.user._id; // ID del usuario autenticado

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: 'ID de comentario inválido.'
            });
        }
        if (!content || content.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'El contenido del comentario no puede estar vacío.'
            });
        }

        // 1. Encontrar el comentario y verificar permisos
        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comentario no encontrado para actualizar.'
            });
        }

        // Verificar si el usuario es el autor o tiene rol de administrador
        // Si tienes roles de ProjectManager, también podrías verificarlo aquí.
        if (String(comment.author) !== String(userId) && req.user.globalRole !== 'Admin') {
            return res.status(403).json({ // 403 Forbidden
                success: false,
                message: 'No tienes permiso para editar este comentario.'
            });
        }

        // 2. Actualizar el comentario
        comment.content = content;
        await comment.save(); // Usamos .save() para ejecutar validadores y timestamps

        // Opcional: Popular el autor para la respuesta
        const populatedComment = await Comment.findById(comment._id).populate('author', 'firstName lastName email');

        res.status(200).json({
            success: true,
            message: 'Comentario actualizado exitosamente.',
            data: populatedComment
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Errores de validación al actualizar el comentario:',
                errors: errors
            });
        }
        console.error("Error en updateComment:", error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor al actualizar el comentario.'
        });
    }
};

//  Eliminar un comentario.
export const deleteComment = async (req, res) => {
    try {
        const { id } = req.params; // ID del comentario
        const userId = req.user._id; // ID del usuario autenticado

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: 'ID de comentario inválido.'
            });
        }

        // 1. Encontrar el comentario y verificar permisos
        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comentario no encontrado para eliminar.'
            });
        }

        // Verificar si el usuario es el autor o tiene rol de administrador
        // Si tienes roles de ProjectManager, también podrías verificarlo aquí.
        if (String(comment.author) !== String(userId) && req.user.globalRole !== 'Admin') {
            return res.status(403).json({ // 403 Forbidden
                success: false,
                message: 'No tienes permiso para eliminar este comentario.'
            });
        }

        // 2. Eliminar el comentario
        await Comment.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Comentario eliminado exitosamente.',
            data: { _id: id } // Devuelve el ID del comentario eliminado
        });
    } catch (error) {
        console.error("Error en deleteComment:", error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor al eliminar el comentario.'
        });
    }
};
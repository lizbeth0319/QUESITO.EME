import Task from '../models/Tasks.js';
import Project from '../models/Project.js';
import User from '../models/User.js';

//Crear una nueva tarea.
export const createTask = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { name, description, assignedTo, dueDate, priority, status } = req.body;
        const createdBy = req.user._id;

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

        // 3. Validar campos obligatorios de la tarea
        if (!name || !description || !dueDate) {
            return res.status(400).json({
                success: false,
                message: 'Los campos nombre, descripción y fecha de vencimiento (dueDate) son obligatorios.'
            });
        }

        // 4. (Opcional) Validar si assignedTo es un usuario existente y miembro del proyecto
        if (assignedTo) {
            if (!assignedTo.match(/^[0-9a-fA-F]{24}$/)) {
                return res.status(400).json({ success: false, message: 'ID de usuario asignado inválido.' });
            }
            const userExists = await User.findById(assignedTo);
            if (!userExists) {
                return res.status(404).json({ success: false, message: 'Usuario asignado no encontrado.' });
            }
            // También podrías verificar si assignedTo es miembro del `project.members`
            // if (!project.members.some(member => String(member.user) === assignedTo)) {
            //     return res.status(400).json({ success: false, message: 'El usuario asignado no es miembro de este proyecto.' });
            // }
        }

        const newTask = new Task({
            name,
            description,
            project: projectId,
            createdBy,
            assignedTo: assignedTo || null,
            dueDate,
            priority: priority || 'Medium',
            status: status || 'Pending',
            isActive: true,
        });

        const savedTask = await newTask.save();

        res.status(201).json({
            success: true,
            message: 'Tarea creada exitosamente.',
            data: savedTask
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Errores de validación al crear la tarea:',
                errors: errors
            });
        }
        console.error("Error en createTask:", error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor al crear la tarea.'
        });
    }
};

//  Listar todas las tareas de un proyecto específico.
export const getTasksByProject = async (req, res) => {
    try {
        const { projectId } = req.params;

        if (!projectId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: 'ID de proyecto inválido.'
            });
        }

        // Opcional: Verificar si el usuario autenticado tiene acceso al proyecto
        // (por ejemplo, es miembro o admin del proyecto)
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ success: false, message: 'Proyecto no encontrado.' });
        }
        // if (!project.members.some(m => String(m.user) === String(req.user._id)) && req.user.globalRole !== 'Admin') {
        //     return res.status(403).json({ success: false, message: 'No tienes permiso para ver las tareas de este proyecto.' });
        // }

        const tasks = await Task.find({ project: projectId, isActive: true }) // Muestra solo tareas activas
            .populate('assignedTo', 'firstName lastName email') // Popula información del usuario asignado
            .populate('createdBy', 'firstName lastName email'); // Popula información del usuario creador

        res.status(200).json({
            success: true,
            message: `Tareas del proyecto '${project.name}' obtenidas exitosamente.`,
            data: tasks
        });
    } catch (error) {
        console.error("Error en getTasksByProject:", error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor al obtener las tareas del proyecto.'
        });
    }
};

//  Obtener una tarea específica por su ID.
export const getTaskById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: 'ID de tarea inválido.'
            });
        }

        const task = await Task.findById(id)
            .populate('project', 'name') // Popula el nombre del proyecto
            .populate('assignedTo', 'firstName lastName email')
            .populate('createdBy', 'firstName lastName email');

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Tarea no encontrada.'
            });
        }

        // Opcional: Verificar permisos para ver esta tarea (ej. si el usuario es miembro del proyecto o asignado)
        // const project = await Project.findById(task.project);
        // if (!project.members.some(m => String(m.user) === String(req.user._id)) && String(task.assignedTo) !== String(req.user._id) && req.user.globalRole !== 'Admin') {
        //     return res.status(403).json({ success: false, message: 'No tienes permiso para ver esta tarea.' });
        // }


        res.status(200).json({
            success: true,
            message: 'Tarea obtenida exitosamente.',
            data: task
        });
    } catch (error) {
        console.error("Error en getTaskById:", error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor al obtener la tarea.'
        });
    }
};

//  Actualizar los detalles generales de una tarea.
export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body; // Puede contener name, description, dueDate, priority, etc.

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: 'ID de tarea inválido.'
            });
        }
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Se requieren datos para actualizar la tarea.'
            });
        }

        // 1. Opcional: Verificar si el usuario tiene permiso para actualizar esta tarea
        // (Ej: Admin, ProjectManager, o si el usuario autenticado es el creador/asignado)
        const existingTask = await Task.findById(id);
        if (!existingTask) {
            return res.status(404).json({ success: false, message: 'Tarea no encontrada.' });
        }
        // Example check:
        // if (String(existingTask.createdBy) !== String(req.user._id) && String(existingTask.assignedTo) !== String(req.user._id) && req.user.globalRole !== 'Admin') {
        //     return res.status(403).json({ success: false, message: 'No tienes permiso para actualizar esta tarea.' });
        // }


        // Evitar que se actualicen campos sensibles directamente aquí si no es intencional
        delete updateData.project;
        delete updateData.createdBy;
        // Si tienes una ruta específica para asignar, también podrías hacer:
        // delete updateData.assignedTo;
        // delete updateData.status;


        const task = await Task.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate('project', 'name').populate('assignedTo', 'firstName lastName email');

        if (!task) { // Este check puede ser redundante si existingTask ya lo manejó
            return res.status(404).json({
                success: false,
                message: 'Tarea no encontrada para actualizar.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Tarea actualizada exitosamente.',
            data: task
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Errores de validación al actualizar la tarea:',
                errors: errors
            });
        }
        console.error("Error en updateTask:", error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor al actualizar la tarea.'
        });
    }
};

//  Actualizar solo el estado de una tarea.
export const updateTaskStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // Solo esperamos el nuevo estado

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ success: false, message: 'ID de tarea inválido.' });
        }
        if (!status) {
            return res.status(400).json({ success: false, message: 'El campo "status" es obligatorio.' });
        }

        // 1. Opcional: Validar el nuevo estado contra una lista de estados permitidos en el esquema.
        // const allowedStatuses = ['Pending', 'InProgress', 'Completed', 'OnHold', 'Cancelled'];
        // if (!allowedStatuses.includes(status)) {
        //     return res.status(400).json({ success: false, message: `Estado inválido. Los estados permitidos son: ${allowedStatuses.join(', ')}.` });
        // }

        // 2. Opcional: Verificar permisos
        const existingTask = await Task.findById(id);
        if (!existingTask) {
            return res.status(404).json({ success: false, message: 'Tarea no encontrada.' });
        }
        // if (String(existingTask.assignedTo) !== String(req.user._id) && req.user.globalRole !== 'Admin') {
        //     return res.status(403).json({ success: false, message: 'No tienes permiso para cambiar el estado de esta tarea.' });
        // }

        const task = await Task.findByIdAndUpdate(
            id,
            { status }, // Solo actualiza el estado
            { new: true, runValidators: true }
        ).populate('assignedTo', 'firstName lastName email');

        if (!task) {
            return res.status(404).json({ success: false, message: 'Tarea no encontrada para actualizar estado.' });
        }

        res.status(200).json({
            success: true,
            message: `Estado de la tarea '${task.name}' actualizado a '${task.status}'.`,
            data: task
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ success: false, message: 'Errores de validación al actualizar estado:', errors: errors });
        }
        console.error("Error en updateTaskStatus:", error);
        res.status(500).json({ success: false, message: 'Error en el servidor al actualizar el estado de la tarea.' });
    }
};

// Asignar una tarea a un usuario.
export const assignTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body; 

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ success: false, message: 'ID de tarea inválido.' });
        }
        if (!userId || !userId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ success: false, message: 'ID de usuario a asignar inválido o faltante.' });
        }

        // Verificar que el usuario a asignar existe
        const userToAssign = await User.findById(userId);
        if (!userToAssign) {
            return res.status(404).json({ success: false, message: 'Usuario a asignar no encontrado.' });
        }

        const task = await Task.findByIdAndUpdate(
            id,
            { assignedTo: userId },
            { new: true, runValidators: true }
        ).populate('assignedTo', 'firstName lastName email');

        if (!task) {
            return res.status(404).json({ success: false, message: 'Tarea no encontrada para asignar.' });
        }

        res.status(200).json({
            success: true,
            message: `Tarea '${task.name}' asignada a ${task.assignedTo.firstName} ${task.assignedTo.lastName} exitosamente.`,
            data: task
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ success: false, message: 'Errores de validación al asignar tarea:', errors: errors });
        }
        console.error("Error en assignTask:", error);
        res.status(500).json({ success: false, message: 'Error en el servidor al asignar la tarea.' });
    }
};

//  Listar tareas asignadas al usuario autenticado.
export const getMyTasks = async (req, res) => {
    try {
        const userId = req.user._id; 

        const tasks = await Task.find({ assignedTo: userId, isActive: true })
            .populate('project', 'name') // Popula el nombre del proyecto
            .populate('createdBy', 'firstName lastName email'); // Popula el creador de la tarea

        res.status(200).json({
            success: true,
            message: `Tareas asignadas a ti obtenidas exitosamente.`,
            data: tasks
        });
    } catch (error) {
        console.error("Error en getMyTasks:", error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor al obtener tus tareas asignadas.'
        });
    }
};

//  Eliminar una tarea por su ID.
export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ success: false, message: 'ID de tarea inválido.' });
        }

        // 1. Opcional: Verificar permisos (Admin o creador de la tarea)
        const existingTask = await Task.findById(id);
        if (!existingTask) {
            return res.status(404).json({ success: false, message: 'Tarea no encontrada.' });
        }
        // if (String(existingTask.createdBy) !== String(req.user._id) && req.user.globalRole !== 'Admin') {
        //     return res.status(403).json({ success: false, message: 'No tienes permiso para eliminar esta tarea.' });
        // }


        const task = await Task.findByIdAndDelete(id);

        if (!task) { // Este check puede ser redundante si existingTask ya lo manejó
            return res.status(404).json({ success: false, message: 'Tarea no encontrada para eliminar.' });
        }

        res.status(200).json({
            success: true,
            message: `Tarea '${task.name}' eliminada exitosamente.`,
            data: { _id: task._id }
        });
    } catch (error) {
        console.error("Error en deleteTask:", error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor al eliminar la tarea.'
        });
    }
};

// **NOTA:** La función `setDependencies` se ha comentado en las rutas
// y podría integrarse como parte de un `updateTask` si el modelo de tareas permite
// actualizar dependencias directamente. Si es una operación separada y compleja,
// podrías mantenerla como una función independiente y añadir la ruta.
// export const setDependencies = async (req, res) => { /* ... */ };
import Category from '../models/Category.js';

//  Obtener y devolver todas las categorías activas.
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({ isActive: true }); 
        res.status(200).json({ 
            success: true,
            message: 'Lista de categorías obtenida exitosamente.',
            data: categories
        });
    } catch (error) {
        console.error("Error en getCategories:", error); 
        res.status(500).json({ 
            success: false,
            message: 'Error en el servidor al obtener las categorías.'
        });
    }
};

//  Crear una nueva categoría.
export const createCategory = async (req, res) => {
    try {
        const { 
            name,
            description } = req.body; 

            const createdBy = req.user._id;//quien lo creo

        if (!name  || !description) {
            return res.status(400).json({
                success: false,
                message: 'El nombre y descripcion de la categoría es obligatorio.'
            });
        }
           if (!name || !description) { // <-- Usando 'descripcion' aquí también
            return res.status(400).json({
                success: false,
                message: 'El nombre y descripcion de la categoria es obligatorio.'
            });
        }
        const newCategory = new Category({
            name,
            description, 
            isActive: true,
            createdBy: createdBy,
        });

        const savedCategory = await newCategory.save();
        console.log(savedCategory)
        
        res.status(201).json({ 
            success: true,
            message: 'Categoría creada exitosamente.',
            data: savedCategory
        });

    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return res.status(400).json({
                success: false,
                message: `Ya existe una categoría con este ${field}.`
            });
        }
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Errores de validación al crear la categoría:',
                errors: errors
            });
        }
        console.error("Error en createCategory:", error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor al crear la categoría.'
        });
    }
};

// Actualizar una categoría existente por su ID.
export const updateCategory = async (req, res) => {
    try {
        const { name: categoryNameToUpdate } = req.params;
        const updateData = req.body;

        if (!categoryNameToUpdate) {
            return res.status(400).json({
                success: false,
                message: 'El nombre de la categoría a actualizar es obligatorio '
            });
        }
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Se requieren datos para actualizar la categoría.'
            });
        }
        const category = await Category.findOneAndUpdate(
            { name: categoryNameToUpdate }, 
            updateData,                   
            { new: true, runValidators: true }
        );

        if (!category) {
            return res.status(404).json({
                success: false,
                message: `Categoría con nombre '${categoryNameToUpdate}' no encontrada para actualizar.`
            });
        }
        res.status(200).json({
            success: true,
            message: 'Categoría actualizada exitosamente.',
            data: category
        });

    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({//mongo
                success: false,
                message: 'Errores de validación al actualizar la categoría:',
                errors: errors
            });
        }
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return res.status(400).json({//revisar!!
                success: false,
                message: `Ya existe una categoría con este ${field}.`
            });
        }
        console.error("Error en updateCategory:", error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor al actualizar la categoría.'
        });
    }
};

//Objetivo: Eliminar una categoría por su ID.
export const deleteCategory = async (req, res) => {
    try {
        const { name: categoryNameToDelete } = req.params;

        if (!categoryNameToDelete) {
            return res.status(400).json({
                success: false,
                message: 'El nombre de la categoría a eliminar es obligatorio en la URL.'
            });
        }
        const category = await Category.findOneAndDelete({ name: categoryNameToDelete });
        
        if (!category) {
            return res.status(404).json({
                success: false,
                message: `Categoría con nombre '${categoryNameToDelete}' no encontrada para eliminar.`
            });
        }
        res.status(200).json({ 
            success: true,
            message: 'Categoría eliminada exitosamente.',
            data: { _id: category._id } 
        });
    } catch (error) {
        console.error("Error en deleteCategory:", error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor al eliminar la categoría.'
        });
    }
};
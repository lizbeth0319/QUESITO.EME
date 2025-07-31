import Role from '../models/Role.js';

export const getRoles = async (req, res) => {
    try {
        const roles = await Role.find({ isActive: true });
        res.json(roles);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching roles', error });
    }
};

export const createRole = async (req, res) => {
    try {
        const {
            name,
            description
        }=req.body; 

        if(!name || !description){
            return res.status(400).json({
                    success: false,
                    error: 'All required fields must be provided.'
            });
        }
        const NewRole=new Role({
            name,
            description,
            isActive: true,
        })
        const savedRole = await NewRole.save();
            console.log(NewRole);
            const userResponse = savedRole.toObject();
        //await role.save();
        
        res.status(200).json({
                success: true,
                message: 'Role created successfully.',
                data: userResponse 
            });
    } catch (error) {
        res.status(400).json({ message: 'Error creating role', error });
    }
};

export const updateRole = async (req, res) => {
    try {
        const role = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!role) return res.status(404).json({ message: 'Role not found' });
        res.json(role);
    } catch (error) {
        res.status(400).json({ message: 'Error updating role', error });
    }
};

export const deleteRole = async (req, res) => {
    try {
        const role = await Role.findByIdAndDelete(req.params.id);
        if (!role) return res.status(404).json({ message: 'Role not found' });
        res.json({ message: 'Role deleted' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting role', error });
    }
};
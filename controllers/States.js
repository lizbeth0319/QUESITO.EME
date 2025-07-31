import State from '../models/States.js';

export const createState = async (req, res) => {
    try {
        const state = new State(req.body);
        await state.save();
        res.status(201).json(state);
    } catch (error) {
        res.status(400).json({ message: 'Error creating state', error });
    }
};

export const getAllStates = async (req, res) => {
    try {
        const states = await State.find();
        res.json(states);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching states', error });
    }
};

export const getStateById = async (req, res) => {
    try {
        const state = await State.findById(req.params.stateId);
        if (!state) return res.status(404).json({ message: 'State not found' });
        res.json(state);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching state', error });
    }
};

export const updateState = async (req, res) => {
    try {
        const state = await State.findByIdAndUpdate(req.params.stateId, req.body, { new: true });
        if (!state) return res.status(404).json({ message: 'State not found' });
        res.json(state);
    } catch (error) {
        res.status(400).json({ message: 'Error updating state', error });
    }
};

export const deleteState = async (req, res) => {
    try {
        const state = await State.findByIdAndDelete(req.params.stateId);
        if (!state) return res.status(404).json({ message: 'State not found' });
        res.json({ message: 'State deleted' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting state', error });
    }
};
//queda en comentarios de momento
/* export const validateTransition = async (req, res) => {
    try {
        res.json({ message: 'Transition validated successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error validating transition', error });
    }
}; */
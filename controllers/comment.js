import Comment from '../models/comment.js';

export const createComment = async (req, res) => {
    try {
        const comment = new Comment({ ...req.body, projectid: req.params.projectId, author: req.user._id });
        await comment.save();
        res.status(201).json(comment);
    } catch (error) {
        res.status(400).json({ message: 'Error creating comment', error });
    }
};

export const getCommentsByProject = async (req, res) => {
    try {
        const comments = await Comment.find({ projectid: req.params.projectId });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching comments', error });
    }
};

export const getCommentsByTask = async (req, res) => {
    try {
        const comments = await Comment.find({ taskId: req.params.taskId });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching comments for task', error });
    }
};

export const updateComment = async (req, res) => {
    try {
        const comment = await Comment.findByIdAndUpdate(req.params.commentId, req.body, { new: true });
        if (!comment) return res.status(404).json({ message: 'Comment not found' });
        res.json(comment);
    } catch (error) {
        res.status(400).json({ message: 'Error updating comment', error });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findByIdAndDelete(req.params.commentId);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });
        res.json({ message: 'Comment deleted' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting comment', error });
    }
};

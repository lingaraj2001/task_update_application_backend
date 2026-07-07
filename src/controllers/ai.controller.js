const { getTaskSuggestion } = require('../services/gemini.service');

exports.suggestTaskDetails = async (req, res) => {
    const { title } = req.body;

    if (!title || title.trim() === '') {
        return res.status(400).json({
            success: false,
            message: 'Task title is required to generate suggestions.'
        });
    }

    try {
        const suggestion = await getTaskSuggestion(title);
        return res.status(200).json({
            success: true,
            suggestion
        });
    } catch (err) {
        console.error('Error in AI suggest controller:', err);
        return res.status(500).json({
            success: false,
            message: 'Failed to generate suggestions.'
        });
    }
};

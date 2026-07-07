const { GoogleGenAI } = require('@google/genai');

const apiKey = process.env.GEMINI_API_KEY;

// Initialize the client if key exists
let ai = null;
if (apiKey && apiKey.trim() !== '') {
    try {
        ai = new GoogleGenAI({ apiKey });
    } catch (err) {
        console.error('Failed to initialize GoogleGenAI client:', err.message);
    }
}

// Fallback suggestion logic if API key is missing or errors out
function getFallbackSuggestion(title) {
    const t = title.toLowerCase();
    let priority = 'Medium';
    let description = `Steps to accomplish task "${title}":\n- Identify goals and requirements\n- Develop the core implementation logic\n- Perform testing and verify correctness`;

    if (t.includes('bug') || t.includes('fix') || t.includes('error') || t.includes('fail') || t.includes('crash')) {
        priority = 'High';
        description = `Detailed debugging path for "${title}":\n1. Reproduce the bug locally\n2. Analyze server/client logs to identify root cause\n3. Write unit tests to prevent regression\n4. Apply patch and verify resolution`;
    } else if (t.includes('style') || t.includes('css') || t.includes('ui') || t.includes('frontend') || t.includes('design') || t.includes('html')) {
        priority = 'Medium';
        description = `Design refinement for "${title}":\n- Review mockup references\n- Implement responsive styling using CSS custom variables\n- Verify cross-browser compatibility and mobile screen sizes`;
    } else if (t.includes('db') || t.includes('database') || t.includes('sql') || t.includes('schema') || t.includes('postgres') || t.includes('model')) {
        priority = 'High';
        description = `Database architecture steps for "${title}":\n- Define tables and columns schema\n- Create migrations and associate tables\n- Add index and integrity constraints\n- Seed mock data for verification`;
    } else if (t.includes('doc') || t.includes('write') || t.includes('readme') || t.includes('comment')) {
        priority = 'Low';
        description = `Documentation update for "${title}":\n- Draft clear configuration/setup instructions\n- Explain architectural design decisions\n- Add JSDoc comments to public methods`;
    }

    return {
        description: `\n\n${description}`,
        priority
    };
}

async function getTaskSuggestion(title) {
    if (!ai) {
        return getFallbackSuggestion(title);
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Suggest a description and a priority level ('Low', 'Medium', or 'High') for a task titled "${title}".
            The description should be structured, concise, and professional (max 200 words).
            Respond ONLY with a valid JSON object matching this schema:
            {
                "description": "suggested description string",
                "priority": "Low" | "Medium" | "High"
            }`,
            config: {
                responseMimeType: 'application/json'
            }
        });

        if (response && response.text) {
            try {
                const parsed = JSON.parse(response.text.trim());
                if (parsed.description && parsed.priority) {
                    return {
                        description: parsed.description,
                        priority: ['Low', 'Medium', 'High'].includes(parsed.priority) ? parsed.priority : 'Medium'
                    };
                }
            } catch (e) {
                console.error('Failed to parse Gemini response JSON:', response.text, e);
            }
        }
        
        // Fallback if structure is wrong
        return getFallbackSuggestion(title);

    } catch (err) {
        console.error('Gemini API call failed:', err.message);
        return getFallbackSuggestion(title);
    }
}

module.exports = {
    getTaskSuggestion
};

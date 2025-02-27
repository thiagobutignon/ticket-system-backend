"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const date_1 = require("./validation/date");
const required_1 = require("./validation/required");
const min_length_1 = require("./validation/min-length");
const tickets = [];
function handler(req, res) {
    if (req.method === 'GET' && req.url === '/') {
        return res.send('Express JS on Vercel');
    }
    if (req.method === 'POST' && req.url === '/tickets') {
        const { title, description, deadline, assignedTo, skills } = req.body;
        if ((0, required_1.isRequired)(title) || (0, min_length_1.minLength)(title, 3)) {
            return res
                .status(400)
                .json({ error: 'Title is required and must be at least 3 characters long' });
        }
        if (skills && !Array.isArray(skills)) {
            return res.status(400).json({ error: 'Skills must be an array of strings' });
        }
        if ((0, required_1.isRequired)(description) || (0, min_length_1.minLength)(description, 3)) {
            return res
                .status(400)
                .json({ error: 'Description is required and must be at least 3 characters long' });
        }
        if ((0, required_1.isRequired)(deadline)) {
            return res.status(400).json({ error: 'Deadline is required' });
        }
        if (typeof deadline !== 'string' || !(0, date_1.isValidDate)(deadline)) {
            return res.status(400).json({ error: 'Invalid deadline format' });
        }
        const deadlineDate = new Date(deadline);
        if (isNaN(deadlineDate.getTime()) || deadlineDate <= new Date()) {
            return res.status(400).json({ error: 'Deadline must be a future date' });
        }
        if (assignedTo && typeof assignedTo !== 'string') {
            return res.status(400).json({ error: 'AssignedTo must be a string' });
        }
        const ticket = {
            id: tickets.length + 1,
            title,
            description,
            deadline: deadlineDate,
            assignedTo,
            skills,
        };
        tickets.push(ticket);
        return res.status(201).json(ticket);
    }
    if (req.method === 'GET' && req.url === '/tickets') {
        return res.json(tickets);
    }
    return res.status(405).json({ error: 'Method Not Allowed' });
}
//# sourceMappingURL=index.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const date_1 = require("./validation/date");
const required_1 = require("./validation/required");
const min_length_1 = require("./validation/min-length");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const tickets = [];
app.get('/', (req, res) => {
    res.send('Express JS on Vercel');
});
app.post('/tickets', (req, res) => {
    const { title, description, deadline, assignedTo } = req.body;
    if ((0, required_1.isRequired)(title) || (0, min_length_1.minLength)(title, 3)) {
        return res
            .status(400)
            .json({ error: 'Title is required and must be at least 3 characters long' });
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
    };
    tickets.push(ticket);
    return res.status(201).json(ticket);
});
app.get('/tickets', (_, res) => {
    res.json(tickets);
});
const port = process.env.PORT || 8080;
app.listen(port, (err) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    else {
        console.log('[INFO] Server Running on port:', port);
    }
});
exports.default = app;
//# sourceMappingURL=server.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tickets = void 0;
exports.assignTeamMember = assignTeamMember;
exports.createTicket = createTicket;
const date_1 = require("../validation/date");
const required_1 = require("../validation/required");
const min_length_1 = require("../validation/min-length");
const teamMemberController_1 = require("./teamMemberController");
exports.tickets = [];
function assignTeamMember(ticketSkills) {
    const teamMembers = (0, teamMemberController_1.getTeamMembers)();
    if (!teamMembers || teamMembers.length === 0) {
        return null;
    }
    if (!ticketSkills || ticketSkills.length === 0) {
        return teamMembers[Math.floor(Math.random() * teamMembers.length)].name;
    }
    for (const member of teamMembers) {
        if (ticketSkills.some(skill => member.role === 'Developer')) { // Assuming only developers can be assigned
            return member.name;
        }
    }
    return null;
}
function createTicket(req, res) {
    const { title, description, deadline, skills } = req.body;
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
    const assignedTo = assignTeamMember(skills);
    const ticket = {
        id: exports.tickets.length + 1,
        title,
        description,
        deadline: deadlineDate,
        assignedTo,
        skills,
    };
    exports.tickets.push(ticket);
    return res.status(201).json(ticket);
}
//# sourceMappingURL=ticketController.js.map
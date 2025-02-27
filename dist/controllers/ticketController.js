"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignTeamMember = assignTeamMember;
exports.createTicket = createTicket;
exports.updateTicketStatus = updateTicketStatus;
const date_1 = require("../validation/date");
const required_1 = require("../validation/required");
const min_length_1 = require("../validation/min-length");
const teamMemberController_1 = require("./teamMemberController");
const path = __importStar(require("path"));
const os_1 = __importDefault(require("os"));
const ticketStore_1 = require("../data/ticketStore");
const TICKETS_FILE_PATH = path.join(os_1.default.tmpdir(), 'tickets.json');
function assignTeamMember(ticketSkills) {
    const teamMembers = (0, teamMemberController_1.getTeamMembers)();
    if (!teamMembers || teamMembers.length === 0) {
        return null;
    }
    if (!ticketSkills || ticketSkills.length === 0) {
        return teamMembers[Math.floor(Math.random() * teamMembers.length)].name;
    }
    for (const member of teamMembers) {
        if (ticketSkills.some(skill => member.role === 'Developer')) {
            return member.name;
        }
    }
    return null;
}
function createTicket(req, res) {
    const { title, description, deadline, skills, assignedTo, status } = req.body;
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
    const ticket = {
        id: 0,
        title,
        description,
        deadline: deadlineDate,
        assignedTo: !assignedTo ? assignedTo : assignTeamMember(skills),
        skills,
        status
    };
    ticketStore_1.ticketStore.addTicket(ticket);
    return res.status(201).json(ticket);
}
function updateTicketStatus(req, res) {
    const { id: ticketId, status } = req.body;
    if (!ticketId) {
        return res.status(400).json({ error: 'Ticket ID is required' });
    }
    if (typeof ticketId !== 'number') {
        return res.status(400).json({ error: 'Invalid ticket ID format' });
    }
    if (!status) {
        return res.status(400).json({ error: 'Status is required' });
    }
    const allowedStatuses = ['To do', 'Doing', 'Done'];
    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status value' });
    }
    const updatedTicket = ticketStore_1.ticketStore.updateTicketStatus(ticketId, status);
    if (!updatedTicket) {
        return res.status(404).json({ error: 'Ticket not found' });
    }
    return res.status(200).json(updatedTicket);
}
//# sourceMappingURL=ticketController.js.map
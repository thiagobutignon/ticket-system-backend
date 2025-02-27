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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ticketStore = void 0;
exports.assignTeamMember = assignTeamMember;
exports.createTicket = createTicket;
const date_1 = require("../validation/date");
const required_1 = require("../validation/required");
const min_length_1 = require("../validation/min-length");
const teamMemberController_1 = require("./teamMemberController");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const TICKETS_FILE_PATH = path.join(process.cwd(), 'tickets.json');
let ticketStoreInstance = null;
function createTicketStore() {
    let tickets = [];
    let nextId = 1; // Initialize nextId
    // Load tickets from file on initialization
    try {
        const fileContent = fs.readFileSync(TICKETS_FILE_PATH, 'utf-8');
        tickets = JSON.parse(fileContent);
        if (tickets.length > 0) {
            nextId = tickets[tickets.length - 1].id + 1;
        }
    }
    catch (error) {
        if (error.code !== 'ENOENT') { // Ignore 'File Not Found' error
            console.error('Error loading tickets from file:', error);
        }
        tickets = []; // Initialize with empty array if file not found or error
    }
    return {
        getTickets: () => {
            // Read tickets from file every time to ensure up-to-date data
            try {
                const fileContent = fs.readFileSync(TICKETS_FILE_PATH, 'utf-8');
                tickets = JSON.parse(fileContent);
            }
            catch (error) {
                if (error.code !== 'ENOENT') { // Ignore 'File Not Found' error
                    console.error('Error loading tickets from file:', error);
                }
                tickets = [];
            }
            console.log('getTickets called', tickets);
            return tickets;
        },
        addTicket: (ticket) => {
            ticket.id = nextId++; // Assign current nextId to ticket and then increment
            tickets.push(ticket);
            // Write tickets to file after adding
            fs.writeFileSync(TICKETS_FILE_PATH, JSON.stringify(tickets, null, 2));
        },
        clearTickets: () => {
            tickets = [];
            nextId = 1; // Reset nextId when clearing tickets
            // Clear the tickets file
            fs.writeFileSync(TICKETS_FILE_PATH, JSON.stringify([]));
        },
    };
}
exports.ticketStore = (() => {
    if (!ticketStoreInstance) {
        ticketStoreInstance = createTicketStore();
    }
    return ticketStoreInstance;
})();
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
        id: 0, // Temporary ID, will be replaced by ticketStore.addTicket
        title,
        description,
        deadline: deadlineDate,
        assignedTo,
        skills,
    };
    exports.ticketStore.addTicket(ticket);
    return res.status(201).json(ticket);
}
//# sourceMappingURL=ticketController.js.map
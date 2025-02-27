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
            console.log('Ticket added and written to tickets.json:', tickets); // Added console log
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
//# sourceMappingURL=ticketStore.js.map
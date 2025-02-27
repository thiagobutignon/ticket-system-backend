"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const ticketController_1 = require("./controllers/ticketController");
const teamMemberController_1 = require("./controllers/teamMemberController");
function handler(req, res) {
    if (req.method === 'GET' && req.url === '/') {
        return res.send('Express JS on Vercel');
    }
    if (req.method === 'POST' && req.url === '/tickets') {
        return (0, ticketController_1.createTicket)(req, res);
    }
    if (req.method === 'GET' && req.url === '/tickets') {
        return res.json(ticketController_1.ticketStore.getTickets());
    }
    if (req.method === 'GET' && req.url === '/team-members') {
        return res.json((0, teamMemberController_1.getTeamMembers)());
    }
    return res.status(405).json({ error: 'Method Not Allowed' });
}
//# sourceMappingURL=index.js.map
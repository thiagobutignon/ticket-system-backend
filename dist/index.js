"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const ticketController_1 = require("./controllers/ticketController");
function handler(req, res) {
    if (req.method === 'GET' && req.url === '/') {
        return res.send('Express JS on Vercel');
    }
    if (req.method === 'POST' && req.url === '/tickets') {
        return (0, ticketController_1.createTicket)(req, res);
    }
    if (req.method === 'GET' && req.url === '/tickets') {
        return res.json(ticketController_1.tickets);
    }
    return res.status(405).json({ error: 'Method Not Allowed' });
}
//# sourceMappingURL=index.js.map
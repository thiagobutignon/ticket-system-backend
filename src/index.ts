import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createTicket, tickets } from './controllers/ticketController';
import { getTeamMembers } from './controllers/teamMemberController';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET' && req.url === '/') {
    return res.send('Express JS on Vercel');
  }

  if (req.method === 'POST' && req.url === '/tickets') {
    return createTicket(req, res);
  }

  if (req.method === 'GET' && req.url === '/tickets') {
    return res.json(tickets);
  }

  if (req.method === 'GET' && req.url === '/team-members') {
    return res.json(getTeamMembers());
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}

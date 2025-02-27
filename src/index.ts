import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Ticket } from './models/ticket';
import { isValidDate } from './validation/date';
import { isRequired } from './validation/required';
import { minLength } from './validation/min-length';

const tickets: Ticket[] = [];

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET' && req.url === '/') {
    return res.send('Express JS on Vercel');
  }

  if (req.method === 'POST' && req.url === '/tickets') {
    const { title, description, deadline, assignedTo } = req.body;

    if (isRequired(title) || minLength(title, 3)) {
      return res
        .status(400)
        .json({ error: 'Title is required and must be at least 3 characters long' });
    }

    if (isRequired(description) || minLength(description, 3)) {
      return res
        .status(400)
        .json({ error: 'Description is required and must be at least 3 characters long' });
    }

    if (isRequired(deadline)) {
      return res.status(400).json({ error: 'Deadline is required' });
    }

    if (typeof deadline !== 'string' || !isValidDate(deadline)) {
      return res.status(400).json({ error: 'Invalid deadline format' });
    }

    const deadlineDate = new Date(deadline);
    if (isNaN(deadlineDate.getTime()) || deadlineDate <= new Date()) {
      return res.status(400).json({ error: 'Deadline must be a future date' });
    }

    if (assignedTo && typeof assignedTo !== 'string') {
      return res.status(400).json({ error: 'AssignedTo must be a string' });
    }

    const ticket: Ticket = {
      id: tickets.length + 1,
      title,
      description,
      deadline: deadlineDate,
      assignedTo,
    };

    tickets.push(ticket);
    return res.status(201).json(ticket);
  }

  if (req.method === 'GET' && req.url === '/tickets') {
    return res.json(tickets);
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}

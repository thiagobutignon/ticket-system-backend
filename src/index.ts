import type { VercelRequest, VercelResponse } from '@vercel/node';
import { v4 as uuidv4 } from 'uuid';

interface Ticket {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  status: 'open' | 'assigned' | 'closed';
  agentId: string | null;
  createdAt: string;
}

const tickets: Ticket[] = [];

const agents = [
  { id: 'agent1', name: 'Alice', skills: ['javascript', 'node.js', 'api'] },
  { id: 'agent2', name: 'Bob', skills: ['react', 'typescript', 'ui/ux'] },
  { id: 'agent3', name: 'Charlie', skills: ['node.js', 'database', 'sql'] },
];

function assignTicket(ticket: Ticket): Ticket {
  const availableAgent = agents.find(agent =>
    ticket.requiredSkills.every(skill => agent.skills.includes(skill))
  );

  if (availableAgent) {
    ticket.agentId = availableAgent.id;
    ticket.status = 'assigned';
  } else {
    ticket.status = 'open';
    ticket.agentId = null;
  }
  return ticket;
}


export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST' && req.url === '/tickets') {
    const { title, description, requiredSkills } = req.body;

    if (!title || !description || !requiredSkills || !Array.isArray(requiredSkills)) {
      return res.status(400).json({ error: 'Missing or invalid ticket details' });
    }

    const newTicket: Ticket = {
      id: uuidv4(),
      title,
      description,
      requiredSkills,
      status: 'open',
      agentId: null,
      createdAt: new Date().toISOString(),
    };

    const assignedTicket = assignTicket(newTicket);
    tickets.push(assignedTicket);
    return res.status(201).json(assignedTicket);
  } else if (req.method === 'GET' && req.url === '/tickets') {
    return res.status(200).json(tickets);
  } else if (req.method === 'PUT' && req.url === '/tickets') {
      tickets.forEach(ticket => {
        if (ticket.status === 'open') { 
          assignTicket(ticket);
        }
      });
      return res.status(200).json({ message: 'Attempted to assign all open tickets.' });
  }
   else {
    return res.status(404).json({ error: 'Endpoint not found' });
  }
}

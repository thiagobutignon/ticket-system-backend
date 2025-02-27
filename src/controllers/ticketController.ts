import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Ticket } from '../models/ticket';
import { isValidDate } from '../validation/date';
import { isRequired } from '../validation/required';
import { minLength } from '../validation/min-length';
import { getTeamMembers } from './teamMemberController';
import * as fs from 'fs';
import * as path from 'path';

const TICKETS_FILE_PATH = path.join(process.cwd(), 'tickets.json');

let ticketStoreInstance: ReturnType<typeof createTicketStore> | null = null;

function createTicketStore() {
  let tickets: Ticket[] = [];
  let nextId = 1; // Initialize nextId

  // Load tickets from file on initialization
  try {
    const fileContent = fs.readFileSync(TICKETS_FILE_PATH, 'utf-8');
    tickets = JSON.parse(fileContent);
    if (tickets.length > 0) {
      nextId = tickets[tickets.length - 1].id + 1;
    }
  } catch (error: any) {
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
      } catch (error: any) {
        if (error.code !== 'ENOENT') { // Ignore 'File Not Found' error
          console.error('Error loading tickets from file:', error);
        }
        tickets = [];
      }
      console.log('getTickets called', tickets);
      return tickets;
    },
    addTicket: (ticket: Ticket) => {
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

export const ticketStore = (() => {
  if (!ticketStoreInstance) {
    ticketStoreInstance = createTicketStore();
  }
  return ticketStoreInstance;
})();


export function assignTeamMember(ticketSkills: string[]): string | null {
  const teamMembers = getTeamMembers();
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

export function createTicket(req: VercelRequest, res: VercelResponse) {
    const { title, description, deadline, skills } = req.body;

    if (isRequired(title) || minLength(title, 3)) {
      return res
        .status(400)
        .json({ error: 'Title is required and must be at least 3 characters long' });
    }

    if (skills && !Array.isArray(skills)) {
      return res.status(400).json({ error: 'Skills must be an array of strings' });
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

    const assignedTo = assignTeamMember(skills);

    const ticket: Ticket = {
      id: 0, // Temporary ID, will be replaced by ticketStore.addTicket
      title,
      description,
      deadline: deadlineDate,
      assignedTo,
      skills,
    };
    ticketStore.addTicket(ticket);
    return res.status(201).json(ticket);
  }

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Ticket } from '../models/ticket';
import { isValidDate } from '../validation/date';
import { isRequired } from '../validation/required';
import { minLength } from '../validation/min-length';
import { getTeamMembers } from './teamMemberController';
import * as path from 'path';
import os from 'os';
import { ticketStore } from '../data/ticketStore';

const TICKETS_FILE_PATH = path.join(os.tmpdir(), 'tickets.json');


export function assignTeamMember(ticketSkills: string[]): string | null {
  const teamMembers = getTeamMembers();
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
    id: 0,
    title,
    description,
    deadline: deadlineDate,
    assignedTo,
    skills,
  };
  ticketStore.addTicket(ticket);
  return res.status(201).json(ticket);
}

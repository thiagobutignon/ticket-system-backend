
import { VercelRequest, VercelResponse } from '@vercel/node';
import { assignTeamMember, tickets, createTicket } from './ticketController';

// Mock Vercel request and response objects
const createMockRequest = (body: any) => {
  return {
    body: body,
  } as VercelRequest;
};

const createMockResponse = () => {
  const res: VercelResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as any as VercelResponse;
  return res;
};

describe('Ticket Controller', () => {
describe('assignTeamMember', () => {
  it('should return null if getTeamMembers returns empty array', () => {
    jest.spyOn(require('./teamMemberController'), 'getTeamMembers').mockReturnValueOnce([]);
    const assignedMember = assignTeamMember([]);
    expect(assignedMember).toBeNull();
  });

  it('should assign a random team member when team members are available', () => {
    jest.spyOn(require('./teamMemberController'), 'getTeamMembers').mockReturnValueOnce([
      { id: '1', name: 'Alice', role: 'Developer' },
      { id: '2', name: 'Bob', role: 'Developer' },
      { id: '3', name: 'Charlie', role: 'Designer' },
    ]);
    const assignedMember = assignTeamMember([]);
    expect(assignedMember).not.toBeNull();
  });
});

describe('createTicket', () => {
  beforeEach(() => {
    tickets.length = 0; // Clear tickets array before each test
  });

  it('should return 400 if title is missing', () => {
    const req = createMockRequest({
      description: 'Debug login issue',
      deadline: '2024-12-31',
      skills: ['javascript'],
    });
    const res = createMockResponse();

    createTicket(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Title is required and must be at least 3 characters long' });
    expect(tickets.length).toBe(0);
  });

  it('should return 400 if title is too short', () => {
    const req = createMockRequest({
      title: 'Fi',
      description: 'Debug login issue',
      deadline: '2024-12-31',
      skills: ['javascript'],
    });
    const res = createMockResponse();

    createTicket(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Title is required and must be at least 3 characters long' });
    expect(tickets.length).toBe(0);
  });

  it('should return 400 if description is missing', () => {
    const req = createMockRequest({
      title: 'Fix bug',
      deadline: '2024-12-31',
      skills: ['javascript'],
    });
    const res = createMockResponse();

    createTicket(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Description is required and must be at least 3 characters long' });
    expect(tickets.length).toBe(0);
  });

  it('should return 400 if description is too short', () => {
    const req = createMockRequest({
      title: 'Fix bug',
      description: 'De',
      deadline: '2024-12-31',
      skills: ['javascript'],
    });
    const res = createMockResponse();

    createTicket(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Description is required and must be at least 3 characters long' });
    expect(tickets.length).toBe(0);
  });

  it('should return 400 if deadline is missing', () => {
    const req = createMockRequest({
      title: 'Fix bug',
      description: 'Debug login issue',
      skills: ['javascript'],
    });
    const res = createMockResponse();

    createTicket(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Deadline is required' });
    expect(tickets.length).toBe(0);
  });

  it('should return 400 if deadline is invalid format', () => {
    const req = createMockRequest({
      title: 'Fix bug',
      description: 'Debug login issue',
      deadline: 'invalid-date',
      skills: ['javascript'],
    });
    const res = createMockResponse();

    createTicket(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid deadline format' });
    expect(tickets.length).toBe(0);
  });

  it('should return 400 if deadline is in the past', () => {
    const req = createMockRequest({
      title: 'Fix bug',
      description: 'Debug login issue',
      deadline: '2020-01-01',
      skills: ['javascript'],
    });
    const res = createMockResponse();

    createTicket(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Deadline must be a future date' });
    expect(tickets.length).toBe(0);
  });

  it('should return 400 if skills is not an array', () => {
    const req = createMockRequest({
      title: 'Fix bug',
      description: 'Debug login issue',
      deadline: '2024-12-31',
      skills: 'javascript', // skills is a string, not array
    });
    const res = createMockResponse();

    createTicket(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Skills must be an array of strings' });
    expect(tickets.length).toBe(0);
  });
});
})

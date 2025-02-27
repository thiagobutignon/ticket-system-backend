import { VercelRequest, VercelResponse } from '@vercel/node';
import handler from '.';

function createMockResponse() {
  const res: Partial<VercelResponse> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res as VercelResponse;
}

describe('Ticket API Integration Tests', () => {
  it('should return welcome message on GET /', async () => {
    const req = { method: 'GET', url: '/' } as VercelRequest;
    const res = createMockResponse();

    handler(req, res);

    expect(res.send).toHaveBeenCalledWith('Express JS on Vercel');
  });

  it('should create a new ticket on POST /tickets', async () => {
    const req = {
      method: 'POST',
      url: '/tickets',
      body: {
        title: 'Fix login bug',
        description: 'There is an issue with the login process',
        deadline: new Date(Date.now() + 86400000).toISOString(),
        skills: ['javascript', 'node.js']
      }
    } as VercelRequest;
    const res = createMockResponse();

    handler(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Fix login bug',
      description: 'There is an issue with the login process',
      assignedTo: "Alice"
    }));
  });

  it('should return all tickets on GET /tickets', async () => {
    const req = { method: 'GET', url: '/tickets' } as VercelRequest;
    const res = createMockResponse();

    handler(req, res);

    expect(res.json).toHaveBeenCalledWith(expect.any(Array));
  });

  it('should return 400 error for invalid ticket creation', async () => {
    const req = {
      method: 'POST',
      url: '/tickets',
      body: { title: '', description: '', deadline: 'invalid-date' }
    } as VercelRequest;
    const res = createMockResponse();

    handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should return 405 for unsupported methods', async () => {
    const req = { method: 'PUT', url: '/tickets' } as VercelRequest;
    const res = createMockResponse();

    handler(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
  });
});

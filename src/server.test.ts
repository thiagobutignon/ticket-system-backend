import request from 'supertest';
import app from '.';

describe('Ticket API Integration Tests', () => {
  let ticketId: number;
  it('should create a new ticket', async () => {
    const newTicket = {
      title: 'Test Ticket',
      description: 'This is a test ticket',
      deadline: '2025-12-31T23:59:59.999Z',
      assignedTo: 'John Doe',
    };

    const response = await request(app)
      .post('/tickets')
      .send(newTicket)
      .expect('Content-Type', /json/)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe(newTicket.title);
    expect(response.body.description).toBe(newTicket.description);
    expect(new Date(response.body.deadline).toISOString()).toBe(newTicket.deadline);
    expect(response.body.assignedTo).toBe(newTicket.assignedTo);

    ticketId = response.body.id;
  });

  it('should get all tickets', async () => {
    const response = await request(app).get('/tickets').expect(200);
    
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should return error if title is missing', async () => {
    const newTicket = {
      description: 'Missing title',
      deadline: '2025-12-31T23:59:59.999Z',
      assignedTo: 'Jane Doe',
    };

    const response = await request(app)
      .post('/tickets')
      .send(newTicket)
      .expect('Content-Type', /json/)
      .expect(400);

    expect(response.body.error).toBe('Title is required and must be at least 3 characters long');
  });

  it('should return error if deadline is in invalid format', async () => {
    const newTicket = {
      title: 'Invalid Deadline',
      description: 'This has an invalid deadline',
      deadline: 'invalid-date',
      assignedTo: 'Jane Doe',
    };

    const response = await request(app)
      .post('/tickets')
      .send(newTicket)
      .expect('Content-Type', /json/)
      .expect(400);

    expect(response.body.error).toBe('Invalid deadline format');
  });

  it('should return a ticket list with at least one item', async () => {
    const response = await request(app).get('/tickets').expect(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should return error if deadline is in the past', async () => {
    const newTicket = {
      title: 'Past Deadline',
      description: 'This has a past deadline',
      deadline: '2022-12-31T23:59:59.999Z',
      assignedTo: 'John Doe',
    };

    const response = await request(app)
      .post('/tickets')
      .send(newTicket)
      .expect('Content-Type', /json/)
      .expect(400);

    expect(response.body.error).toBe('Deadline must be a future date');
  });

  it('should return error if required fields are missing', async () => {
    const newTicket = {
      description: 'Missing title and deadline',
      assignedTo: 'John Doe',
    };

    const response = await request(app)
      .post('/tickets')
      .send(newTicket)
      .expect('Content-Type', /json/)
      .expect(400);

    expect(response.body.error).toBe('Title is required and must be at least 3 characters long');
  });
});

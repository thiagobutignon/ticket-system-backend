"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ticketController_1 = require("./ticketController");
const ticketStore_1 = require("../data/ticketStore");
const createMockRequest = (body) => {
    return {
        body: body,
    };
};
const createMockResponse = () => {
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    };
    return res;
};
describe('Ticket Controller', () => {
    describe('assignTeamMember', () => {
        it('should return null if getTeamMembers returns empty array', () => {
            jest.spyOn(require('./teamMemberController'), 'getTeamMembers').mockReturnValueOnce([]);
            const assignedMember = (0, ticketController_1.assignTeamMember)([]);
            expect(assignedMember).toBeNull();
        });
        it('should assign a random team member when team members are available', () => {
            jest.spyOn(require('./teamMemberController'), 'getTeamMembers').mockReturnValueOnce([
                { id: '1', name: 'Alice', role: 'Developer' },
                { id: '2', name: 'Bob', role: 'Developer' },
                { id: '3', name: 'Charlie', role: 'Designer' },
            ]);
            const assignedMember = (0, ticketController_1.assignTeamMember)([]);
            expect(assignedMember).not.toBeNull();
        });
    });
    describe('createTicket', () => {
        beforeEach(() => {
            ticketStore_1.ticketStore.getTickets().length = 0; // Clear tickets array before each test
        });
        it('should return 400 if title is missing', () => {
            const req = createMockRequest({
                description: 'Debug login issue',
                deadline: '2024-12-31',
                skills: ['javascript'],
            });
            const res = createMockResponse();
            (0, ticketController_1.createTicket)(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Title is required and must be at least 3 characters long' });
            expect(ticketStore_1.ticketStore.getTickets().length).toBe(0);
        });
        it('should return 400 if title is too short', () => {
            const req = createMockRequest({
                title: 'Fi',
                description: 'Debug login issue',
                deadline: '2024-12-31',
                skills: ['javascript'],
            });
            const res = createMockResponse();
            (0, ticketController_1.createTicket)(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Title is required and must be at least 3 characters long' });
            expect(ticketStore_1.ticketStore.getTickets().length).toBe(0);
        });
        it('should return 400 if description is missing', () => {
            const req = createMockRequest({
                title: 'Fix bug',
                deadline: '2024-12-31',
                skills: ['javascript'],
            });
            const res = createMockResponse();
            (0, ticketController_1.createTicket)(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Description is required and must be at least 3 characters long' });
            expect(ticketStore_1.ticketStore.getTickets().length).toBe(0);
        });
        it('should return 400 if description is too short', () => {
            const req = createMockRequest({
                title: 'Fix bug',
                description: 'De',
                deadline: '2024-12-31',
                skills: ['javascript'],
            });
            const res = createMockResponse();
            (0, ticketController_1.createTicket)(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Description is required and must be at least 3 characters long' });
            expect(ticketStore_1.ticketStore.getTickets().length).toBe(0);
        });
        it('should return 400 if deadline is missing', () => {
            const req = createMockRequest({
                title: 'Fix bug',
                description: 'Debug login issue',
                skills: ['javascript'],
            });
            const res = createMockResponse();
            (0, ticketController_1.createTicket)(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Deadline is required' });
            expect(ticketStore_1.ticketStore.getTickets().length).toBe(0);
        });
        it('should return 400 if deadline is invalid format', () => {
            const req = createMockRequest({
                title: 'Fix bug',
                description: 'Debug login issue',
                deadline: 'invalid-date',
                skills: ['javascript'],
            });
            const res = createMockResponse();
            (0, ticketController_1.createTicket)(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Invalid deadline format' });
            expect(ticketStore_1.ticketStore.getTickets().length).toBe(0);
        });
        it('should return 400 if deadline is in the past', () => {
            const req = createMockRequest({
                title: 'Fix bug',
                description: 'Debug login issue',
                deadline: '2020-01-01',
                skills: ['javascript'],
            });
            const res = createMockResponse();
            (0, ticketController_1.createTicket)(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Deadline must be a future date' });
            expect(ticketStore_1.ticketStore.getTickets().length).toBe(0);
        });
        it('should return 400 if skills is not an array', () => {
            const req = createMockRequest({
                title: 'Fix bug',
                description: 'Debug login issue',
                deadline: '2024-12-31',
                skills: 'javascript', // skills is a string, not array
            });
            const res = createMockResponse();
            (0, ticketController_1.createTicket)(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Skills must be an array of strings' });
            expect(ticketStore_1.ticketStore.getTickets().length).toBe(0);
        });
    });
});
//# sourceMappingURL=ticketController.test.js.map
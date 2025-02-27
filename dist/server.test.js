"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("./server"));
describe('Ticket API Integration Tests', () => {
    let ticketId;
    it('should create a new ticket', () => __awaiter(void 0, void 0, void 0, function* () {
        const newTicket = {
            title: 'Test Ticket',
            description: 'This is a test ticket',
            deadline: '2025-12-31T23:59:59.999Z',
            assignedTo: 'John Doe',
        };
        const response = yield (0, supertest_1.default)(server_1.default)
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
    }));
    it('should get all tickets', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).get('/tickets').expect(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
    }));
    it('should return error if title is missing', () => __awaiter(void 0, void 0, void 0, function* () {
        const newTicket = {
            description: 'Missing title',
            deadline: '2025-12-31T23:59:59.999Z',
            assignedTo: 'Jane Doe',
        };
        const response = yield (0, supertest_1.default)(server_1.default)
            .post('/tickets')
            .send(newTicket)
            .expect('Content-Type', /json/)
            .expect(400);
        expect(response.body.error).toBe('Title is required and must be at least 3 characters long');
    }));
    it('should return error if deadline is in invalid format', () => __awaiter(void 0, void 0, void 0, function* () {
        const newTicket = {
            title: 'Invalid Deadline',
            description: 'This has an invalid deadline',
            deadline: 'invalid-date',
            assignedTo: 'Jane Doe',
        };
        const response = yield (0, supertest_1.default)(server_1.default)
            .post('/tickets')
            .send(newTicket)
            .expect('Content-Type', /json/)
            .expect(400);
        expect(response.body.error).toBe('Invalid deadline format');
    }));
    it('should return a ticket list with at least one item', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).get('/tickets').expect(200);
        expect(response.body.length).toBeGreaterThan(0);
    }));
    it('should return error if deadline is in the past', () => __awaiter(void 0, void 0, void 0, function* () {
        const newTicket = {
            title: 'Past Deadline',
            description: 'This has a past deadline',
            deadline: '2022-12-31T23:59:59.999Z',
            assignedTo: 'John Doe',
        };
        const response = yield (0, supertest_1.default)(server_1.default)
            .post('/tickets')
            .send(newTicket)
            .expect('Content-Type', /json/)
            .expect(400);
        expect(response.body.error).toBe('Deadline must be a future date');
    }));
    it('should return error if required fields are missing', () => __awaiter(void 0, void 0, void 0, function* () {
        const newTicket = {
            description: 'Missing title and deadline',
            assignedTo: 'John Doe',
        };
        const response = yield (0, supertest_1.default)(server_1.default)
            .post('/tickets')
            .send(newTicket)
            .expect('Content-Type', /json/)
            .expect(400);
        expect(response.body.error).toBe('Title is required and must be at least 3 characters long');
    }));
});
//# sourceMappingURL=server.test.js.map
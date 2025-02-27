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
const _1 = __importDefault(require("."));
function createMockResponse() {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
}
describe('Ticket API Integration Tests', () => {
    it('should return welcome message on GET /', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = { method: 'GET', url: '/' };
        const res = createMockResponse();
        (0, _1.default)(req, res);
        expect(res.send).toHaveBeenCalledWith('Express JS on Vercel');
    }));
    it('should create a new ticket on POST /tickets', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = {
            method: 'POST',
            url: '/tickets',
            body: {
                title: 'Fix login bug',
                description: 'There is an issue with the login process',
                deadline: new Date(Date.now() + 86400000).toISOString(),
                skills: ['javascript', 'node.js']
            }
        };
        const res = createMockResponse();
        (0, _1.default)(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            title: 'Fix login bug',
            description: 'There is an issue with the login process',
            assignedTo: "Alice"
        }));
    }));
    it('should return all tickets on GET /tickets', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = { method: 'GET', url: '/tickets' };
        const res = createMockResponse();
        (0, _1.default)(req, res);
        expect(res.json).toHaveBeenCalledWith(expect.any(Array));
    }));
    it('should return 400 error for invalid ticket creation', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = {
            method: 'POST',
            url: '/tickets',
            body: { title: '', description: '', deadline: 'invalid-date' }
        };
        const res = createMockResponse();
        (0, _1.default)(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
    }));
    it('should return 405 for unsupported methods', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = { method: 'PUT', url: '/tickets' };
        const res = createMockResponse();
        (0, _1.default)(req, res);
        expect(res.status).toHaveBeenCalledWith(405);
    }));
});
//# sourceMappingURL=index.test.js.map
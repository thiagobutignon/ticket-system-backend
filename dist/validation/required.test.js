"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const required_1 = require("./required");
describe('isRequired', () => {
    it('should return true for null', () => {
        expect((0, required_1.isRequired)(null)).toBeTruthy();
    });
    it('should return true for undefined', () => {
        expect((0, required_1.isRequired)(undefined)).toBeTruthy();
    });
    it('should return true for an empty string', () => {
        expect((0, required_1.isRequired)('')).toBeTruthy();
    });
    it('should return false for a non-empty string', () => {
        expect((0, required_1.isRequired)('test')).toBeFalsy();
    });
    it('should return false for a number', () => {
        expect((0, required_1.isRequired)(123)).toBeFalsy();
    });
    it('should return false for an object', () => {
        expect((0, required_1.isRequired)({})).toBeFalsy();
    });
    it('should return false for an array', () => {
        expect((0, required_1.isRequired)([])).toBeFalsy();
    });
});
//# sourceMappingURL=required.test.js.map
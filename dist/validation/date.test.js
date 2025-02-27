"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const date_1 = require("./date");
describe('isValidDate', () => {
    it('should return true for a valid date string', () => {
        expect((0, date_1.isValidDate)('2024-01-01')).toBeTruthy();
    });
    it('should return false for an invalid date string', () => {
        expect((0, date_1.isValidDate)('invalid-date')).toBeFalsy();
    });
    it('should return false for an empty string', () => {
        expect((0, date_1.isValidDate)('')).toBeFalsy();
    });
    it('should return false for null', () => {
        expect((0, date_1.isValidDate)(null)).toBeFalsy();
    });
    it('should return false for undefined', () => {
        expect((0, date_1.isValidDate)(undefined)).toBeFalsy();
    });
});
//# sourceMappingURL=date.test.js.map
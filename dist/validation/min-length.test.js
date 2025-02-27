"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const min_length_1 = require("./min-length");
describe('minLength', () => {
    it('should return true if the value length is less than the specified length', () => {
        expect((0, min_length_1.minLength)('test', 5)).toBeTruthy();
    });
    it('should return false if the value length is equal to the specified length', () => {
        expect((0, min_length_1.minLength)('test', 4)).toBeFalsy();
    });
    it('should return false if the value length is greater than the specified length', () => {
        expect((0, min_length_1.minLength)('test', 3)).toBeFalsy();
    });
    it('should return true for an empty string and a length greater than 0', () => {
        expect((0, min_length_1.minLength)('', 1)).toBeTruthy();
    });
    it('should return false for an empty string and a length of 0', () => {
        expect((0, min_length_1.minLength)('', 0)).toBeFalsy();
    });
});
//# sourceMappingURL=min-length.test.js.map
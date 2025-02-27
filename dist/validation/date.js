"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidDate = void 0;
const isValidDate = (dateString) => {
    if (!dateString) {
        return false;
    }
    try {
        const date = new Date(dateString);
        return !isNaN(date.getTime());
    }
    catch (error) {
        return false;
    }
};
exports.isValidDate = isValidDate;
//# sourceMappingURL=date.js.map
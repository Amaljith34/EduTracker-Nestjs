"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.devLog = devLog;
function devLog(...args) {
    if (process.env.LOG_LEVEL === 'production') {
        return;
    }
    console.log(...args);
}
//# sourceMappingURL=log-helper.js.map
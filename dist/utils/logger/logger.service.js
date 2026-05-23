"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logDebug = exports.logWarn = exports.logError = exports.logInfo = void 0;
const logInfo = (message) => console.log(`[INFO] ${message}`);
exports.logInfo = logInfo;
const logError = (message, trace) => console.error(`[ERROR] ${message}`, trace ?? '');
exports.logError = logError;
const logWarn = (message) => console.warn(`[WARN] ${message}`);
exports.logWarn = logWarn;
const logDebug = (message) => console.debug(`[DEBUG] ${message}`);
exports.logDebug = logDebug;
//# sourceMappingURL=logger.service.js.map
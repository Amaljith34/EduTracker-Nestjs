"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecordStatus = exports.DBStatus = void 0;
var DBStatus;
(function (DBStatus) {
    DBStatus["ACTIVE"] = "ACTIVE";
    DBStatus["HOLD"] = "HOLD";
    DBStatus["DELETED"] = "DELETED";
})(DBStatus || (exports.DBStatus = DBStatus = {}));
var RecordStatus;
(function (RecordStatus) {
    RecordStatus["PENDING"] = "Pending";
    RecordStatus["APPROVED"] = "Approved";
    RecordStatus["DELETED"] = "Deleted";
})(RecordStatus || (exports.RecordStatus = RecordStatus = {}));
//# sourceMappingURL=types.js.map
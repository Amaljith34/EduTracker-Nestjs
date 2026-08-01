"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubjectCatalogSchema = exports.SubjectCatalog = exports.SubjectStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var SubjectStatus;
(function (SubjectStatus) {
    SubjectStatus["ACTIVE"] = "active";
    SubjectStatus["HOLD"] = "hold";
    SubjectStatus["INACTIVE"] = "inactive";
    SubjectStatus["DELETED"] = "deleted";
})(SubjectStatus || (exports.SubjectStatus = SubjectStatus = {}));
let SubjectCatalog = class SubjectCatalog {
};
exports.SubjectCatalog = SubjectCatalog;
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true, lowercase: true }),
    __metadata("design:type", String)
], SubjectCatalog.prototype, "subjectName", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        type: String,
        enum: SubjectStatus,
        default: SubjectStatus.ACTIVE,
    }),
    __metadata("design:type", String)
], SubjectCatalog.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId, ref: 'User', required: false, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], SubjectCatalog.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: false }),
    __metadata("design:type", String)
], SubjectCatalog.prototype, "createdByName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: false }),
    __metadata("design:type", String)
], SubjectCatalog.prototype, "createdByType", void 0);
exports.SubjectCatalog = SubjectCatalog = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'subjects' })
], SubjectCatalog);
exports.SubjectCatalogSchema = mongoose_1.SchemaFactory.createForClass(SubjectCatalog);
//# sourceMappingURL=subject-catalog.schema.js.map
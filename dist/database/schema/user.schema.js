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
exports.UserSchema = exports.User = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const class_transformer_1 = require("class-transformer");
const auth_type_1 = require("../../api/auth/auth.type");
const types_1 = require("../types");
const user_subject_schema_1 = require("./user-subject.schema");
let User = class User {
};
exports.User = User;
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: String, unique: true, lowercase: true, trim: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: String }),
    __metadata("design:type", String)
], User.prototype, "fullName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, trim: true }),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, select: false }),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: String, enum: auth_type_1.UserType, default: auth_type_1.UserType.USER }),
    __metadata("design:type", String)
], User.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: types_1.DBStatus, default: types_1.DBStatus.ACTIVE }),
    __metadata("design:type", String)
], User.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId, ref: 'User', index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], User.prototype, "subscriberId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [mongoose_2.SchemaTypes.ObjectId], ref: 'User', default: [] }),
    __metadata("design:type", Array)
], User.prototype, "subscriberIds", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [user_subject_schema_1.UserSubjectSchema], default: [] }),
    __metadata("design:type", Array)
], User.prototype, "subjects", void 0);
__decorate([
    (0, mongoose_1.Prop)({ select: false }),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", String)
], User.prototype, "refreshToken", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], User.prototype, "createdBy", void 0);
exports.User = User = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'users' })
], User);
exports.UserSchema = mongoose_1.SchemaFactory.createForClass(User);
exports.UserSchema.index({ subscriberId: 1, email: 1 });
//# sourceMappingURL=user.schema.js.map
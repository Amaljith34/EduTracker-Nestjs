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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubjectCatalogRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const subject_catalog_schema_1 = require("../schema/subject-catalog.schema");
let SubjectCatalogRepository = class SubjectCatalogRepository {
    constructor(subjectModel) {
        this.subjectModel = subjectModel;
    }
    findByNameNormalized(subjectName) {
        const normalized = subjectName.trim().toLowerCase();
        return this.subjectModel.findOne({ subjectName: normalized });
    }
    create(data) {
        return this.subjectModel.create({
            ...data,
            subjectName: data.subjectName.trim().toLowerCase(),
        });
    }
    findAll(filter = {}) {
        return this.subjectModel.find(filter).sort({ subjectName: 1 });
    }
    findById(id) {
        return this.subjectModel.findById(id);
    }
    updateById(id, data) {
        const update = { ...data };
        if (data.subjectName) {
            update.subjectName = data.subjectName.trim().toLowerCase();
        }
        return this.subjectModel.findByIdAndUpdate(id, update, { new: true });
    }
    deleteById(id) {
        return this.subjectModel.findByIdAndDelete(id);
    }
    countActive() {
        return this.subjectModel.countDocuments({ status: subject_catalog_schema_1.SubjectStatus.ACTIVE });
    }
};
exports.SubjectCatalogRepository = SubjectCatalogRepository;
exports.SubjectCatalogRepository = SubjectCatalogRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(subject_catalog_schema_1.SubjectCatalog.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], SubjectCatalogRepository);
//# sourceMappingURL=subject-catalog.repository.js.map
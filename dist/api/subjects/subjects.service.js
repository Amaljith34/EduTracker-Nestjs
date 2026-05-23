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
exports.SubjectsService = void 0;
const common_1 = require("@nestjs/common");
const subject_catalog_repository_1 = require("../../database/repositories/subject-catalog.repository");
let SubjectsService = class SubjectsService {
    constructor(subjectRepository) {
        this.subjectRepository = subjectRepository;
    }
    async create(dto) {
        const existing = await this.subjectRepository.findByNameNormalized(dto.subjectName);
        if (existing) {
            throw new common_1.ConflictException(`Subject "${dto.subjectName.trim()}" already exists`);
        }
        const subject = await this.subjectRepository.create({
            subjectName: dto.subjectName,
            status: dto.status,
        });
        return this.toResponse(subject);
    }
    async findAll(status) {
        const filter = status ? { status } : {};
        const subjects = await this.subjectRepository.findAll(filter);
        return subjects.map((s) => this.toResponse(s));
    }
    async findOne(id) {
        const subject = await this.subjectRepository.findById(id);
        if (!subject)
            throw new common_1.NotFoundException('Subject not found');
        return this.toResponse(subject);
    }
    async update(id, dto) {
        const subject = await this.subjectRepository.findById(id);
        if (!subject)
            throw new common_1.NotFoundException('Subject not found');
        if (dto.subjectName) {
            const duplicate = await this.subjectRepository.findByNameNormalized(dto.subjectName);
            if (duplicate && duplicate._id.toString() !== id) {
                throw new common_1.ConflictException(`Subject "${dto.subjectName.trim()}" already exists`);
            }
        }
        const updated = await this.subjectRepository.updateById(id, dto);
        return this.toResponse(updated);
    }
    async remove(id) {
        const subject = await this.subjectRepository.findById(id);
        if (!subject)
            throw new common_1.NotFoundException('Subject not found');
        await this.subjectRepository.deleteById(id);
        return { message: 'Subject deleted successfully' };
    }
    toResponse(subject) {
        return {
            subjectId: subject._id.toString(),
            subjectName: this.displayName(subject.subjectName),
            status: subject.status,
            createdAt: subject.createdAt,
            updatedAt: subject.updatedAt,
        };
    }
    displayName(name) {
        return name
            .split(' ')
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');
    }
};
exports.SubjectsService = SubjectsService;
exports.SubjectsService = SubjectsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [subject_catalog_repository_1.SubjectCatalogRepository])
], SubjectsService);
//# sourceMappingURL=subjects.service.js.map
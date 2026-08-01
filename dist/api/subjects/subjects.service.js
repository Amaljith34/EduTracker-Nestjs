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
const mongoose_1 = require("mongoose");
const subject_catalog_schema_1 = require("../../database/schema/subject-catalog.schema");
const subject_catalog_repository_1 = require("../../database/repositories/subject-catalog.repository");
const auth_type_1 = require("../auth/auth.type");
let SubjectsService = class SubjectsService {
    constructor(subjectRepository) {
        this.subjectRepository = subjectRepository;
    }
    async create(authUser, dto) {
        const existing = await this.subjectRepository.findByNameNormalized(dto.subjectName);
        if (existing && existing.status !== subject_catalog_schema_1.SubjectStatus.DELETED) {
            throw new common_1.ConflictException(`Subject "${dto.subjectName.trim()}" already exists`);
        }
        const isSubscriber = authUser.type === auth_type_1.UserType.SUBSCRIBER;
        const status = isSubscriber
            ? subject_catalog_schema_1.SubjectStatus.HOLD
            : dto.status || subject_catalog_schema_1.SubjectStatus.ACTIVE;
        const meta = {
            createdBy: new mongoose_1.Types.ObjectId(authUser.userId),
            createdByName: authUser.fullName,
            createdByType: authUser.type,
        };
        if (existing && existing.status === subject_catalog_schema_1.SubjectStatus.DELETED) {
            const restored = await this.subjectRepository.updateById(existing._id.toString(), {
                subjectName: dto.subjectName,
                status,
                ...meta,
            });
            return this.toResponse(restored);
        }
        const subject = await this.subjectRepository.create({
            subjectName: dto.subjectName,
            status,
            ...meta,
        });
        return this.toResponse(subject);
    }
    async findAll(authUser, status) {
        const filter = {
            status: { $ne: subject_catalog_schema_1.SubjectStatus.DELETED },
        };
        if (status) {
            filter.status = status;
        }
        const subjects = await this.subjectRepository.findAll(filter);
        return subjects
            .filter((s) => {
            if (s.status !== subject_catalog_schema_1.SubjectStatus.HOLD)
                return true;
            if (authUser.type === auth_type_1.UserType.ADMIN)
                return true;
            return s.createdBy?.toString() === authUser.userId;
        })
            .map((s) => this.toResponse(s));
    }
    async findOne(authUser, id) {
        const subject = await this.subjectRepository.findById(id);
        if (!subject || subject.status === subject_catalog_schema_1.SubjectStatus.DELETED) {
            throw new common_1.NotFoundException('Subject not found');
        }
        if (subject.status === subject_catalog_schema_1.SubjectStatus.HOLD &&
            authUser.type !== auth_type_1.UserType.ADMIN &&
            subject.createdBy?.toString() !== authUser.userId) {
            throw new common_1.ForbiddenException('Subject is on hold');
        }
        return this.toResponse(subject);
    }
    async update(authUser, id, dto) {
        if (authUser.type !== auth_type_1.UserType.ADMIN) {
            throw new common_1.ForbiddenException('Only admin can update subjects');
        }
        const subject = await this.subjectRepository.findById(id);
        if (!subject || subject.status === subject_catalog_schema_1.SubjectStatus.DELETED) {
            throw new common_1.NotFoundException('Subject not found');
        }
        if (dto.subjectName) {
            const duplicate = await this.subjectRepository.findByNameNormalized(dto.subjectName);
            if (duplicate &&
                duplicate._id.toString() !== id &&
                duplicate.status !== subject_catalog_schema_1.SubjectStatus.DELETED) {
                throw new common_1.ConflictException(`Subject "${dto.subjectName.trim()}" already exists`);
            }
        }
        const updated = await this.subjectRepository.updateById(id, dto);
        return this.toResponse(updated);
    }
    async remove(authUser, id) {
        if (authUser.type !== auth_type_1.UserType.ADMIN) {
            throw new common_1.ForbiddenException('Only admin can delete subjects');
        }
        const subject = await this.subjectRepository.findById(id);
        if (!subject || subject.status === subject_catalog_schema_1.SubjectStatus.DELETED) {
            throw new common_1.NotFoundException('Subject not found');
        }
        await this.subjectRepository.updateById(id, { status: subject_catalog_schema_1.SubjectStatus.DELETED });
        return { message: 'Subject deleted successfully' };
    }
    toResponse(subject) {
        return {
            subjectId: subject._id.toString(),
            subjectName: this.displayName(subject.subjectName),
            status: subject.status,
            createdBy: subject.createdBy?.toString(),
            createdByName: subject.createdByName,
            createdByType: subject.createdByType,
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
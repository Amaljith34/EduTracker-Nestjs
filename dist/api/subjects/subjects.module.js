"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubjectsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const subject_catalog_schema_1 = require("../../database/schema/subject-catalog.schema");
const subject_catalog_repository_1 = require("../../database/repositories/subject-catalog.repository");
const auth_module_1 = require("../auth/auth.module");
const subjects_controller_1 = require("./subjects.controller");
const subjects_service_1 = require("./subjects.service");
let SubjectsModule = class SubjectsModule {
};
exports.SubjectsModule = SubjectsModule;
exports.SubjectsModule = SubjectsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule,
            mongoose_1.MongooseModule.forFeature([
                { name: subject_catalog_schema_1.SubjectCatalog.name, schema: subject_catalog_schema_1.SubjectCatalogSchema },
            ]),
        ],
        controllers: [subjects_controller_1.SubjectsController],
        providers: [subjects_service_1.SubjectsService, subject_catalog_repository_1.SubjectCatalogRepository],
        exports: [subjects_service_1.SubjectsService, subject_catalog_repository_1.SubjectCatalogRepository],
    })
], SubjectsModule);
//# sourceMappingURL=subjects.module.js.map
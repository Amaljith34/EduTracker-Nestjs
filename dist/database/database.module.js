"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const user_schema_1 = require("./schema/user.schema");
const review_schema_1 = require("./schema/review.schema");
const transaction_schema_1 = require("./schema/transaction.schema");
const subject_catalog_schema_1 = require("./schema/subject-catalog.schema");
const user_repository_1 = require("./repositories/user.repository");
const review_repository_1 = require("./repositories/review.repository");
const transaction_repository_1 = require("./repositories/transaction.repository");
const index_sync_service_1 = require("./index-sync.service");
const features = [
    { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
    { name: review_schema_1.Review.name, schema: review_schema_1.ReviewSchema },
    { name: transaction_schema_1.Transaction.name, schema: transaction_schema_1.TransactionSchema },
    { name: subject_catalog_schema_1.SubjectCatalog.name, schema: subject_catalog_schema_1.SubjectCatalogSchema },
];
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature(features)],
        providers: [
            user_repository_1.UserRepository,
            review_repository_1.ReviewRepository,
            transaction_repository_1.TransactionRepository,
            index_sync_service_1.IndexSyncService,
        ],
        exports: [
            user_repository_1.UserRepository,
            review_repository_1.ReviewRepository,
            transaction_repository_1.TransactionRepository,
            mongoose_1.MongooseModule.forFeature(features),
        ],
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map
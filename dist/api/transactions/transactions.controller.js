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
exports.TransactionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_guard_1 = require("../auth/guard/auth.guard");
const authGuardPermisssion_1 = require("../auth/decorators/authGuardPermisssion");
const authUser_1 = require("../auth/decorators/authUser");
const auth_type_1 = require("../auth/auth.type");
const transactions_service_1 = require("./transactions.service");
const create_transaction_dto_1 = require("./dto/create-transaction.dto");
const update_transaction_dto_1 = require("./dto/update-transaction.dto");
const filter_transaction_dto_1 = require("./dto/filter-transaction.dto");
let TransactionsController = class TransactionsController {
    constructor(transactionsService) {
        this.transactionsService = transactionsService;
    }
    create(authUser, dto) {
        return this.transactionsService.create(authUser, dto);
    }
    findAll(authUser, query) {
        return this.transactionsService.findAll(authUser, query);
    }
    getBalance(authUser, userId) {
        return this.transactionsService.getBalanceForUser(authUser, userId);
    }
    update(authUser, id, dto) {
        return this.transactionsService.update(authUser, id, dto);
    }
    async remove(authUser, id) {
        await this.transactionsService.remove(authUser, id);
    }
};
exports.TransactionsController = TransactionsController;
__decorate([
    (0, common_1.Post)(),
    (0, authGuardPermisssion_1.AuthGuardPermissions)({ allowedUsers: [auth_type_1.UserType.ADMIN, auth_type_1.UserType.SUBSCRIBER] }),
    __param(0, (0, authUser_1.AuthUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_transaction_dto_1.CreateTransactionDto]),
    __metadata("design:returntype", void 0)
], TransactionsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, authGuardPermisssion_1.AuthGuardPermissions)({
        allowedUsers: [auth_type_1.UserType.ADMIN, auth_type_1.UserType.SUBSCRIBER, auth_type_1.UserType.USER],
    }),
    __param(0, (0, authUser_1.AuthUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, filter_transaction_dto_1.FilterTransactionDto]),
    __metadata("design:returntype", void 0)
], TransactionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('balance/:userId'),
    (0, authGuardPermisssion_1.AuthGuardPermissions)({
        allowedUsers: [auth_type_1.UserType.ADMIN, auth_type_1.UserType.SUBSCRIBER],
    }),
    __param(0, (0, authUser_1.AuthUser)()),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], TransactionsController.prototype, "getBalance", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, authGuardPermisssion_1.AuthGuardPermissions)({ allowedUsers: [auth_type_1.UserType.ADMIN, auth_type_1.UserType.SUBSCRIBER] }),
    __param(0, (0, authUser_1.AuthUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_transaction_dto_1.UpdateTransactionDto]),
    __metadata("design:returntype", void 0)
], TransactionsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(204),
    (0, authGuardPermisssion_1.AuthGuardPermissions)({ allowedUsers: [auth_type_1.UserType.ADMIN, auth_type_1.UserType.SUBSCRIBER] }),
    __param(0, (0, authUser_1.AuthUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "remove", null);
exports.TransactionsController = TransactionsController = __decorate([
    (0, common_1.Controller)('transactions'),
    (0, swagger_1.ApiTags)('Transactions'),
    (0, swagger_1.ApiBearerAuth)('Token'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [transactions_service_1.TransactionsService])
], TransactionsController);
//# sourceMappingURL=transactions.controller.js.map
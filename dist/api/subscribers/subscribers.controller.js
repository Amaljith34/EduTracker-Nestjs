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
exports.SubscribersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_guard_1 = require("../auth/guard/auth.guard");
const authGuardPermisssion_1 = require("../auth/decorators/authGuardPermisssion");
const authUser_1 = require("../auth/decorators/authUser");
const auth_type_1 = require("../auth/auth.type");
const subscribers_service_1 = require("./subscribers.service");
const create_subscriber_dto_1 = require("./dto/create-subscriber.dto");
const update_subscriber_dto_1 = require("./dto/update-subscriber.dto");
const filterUser_dto_1 = require("../user/dto/filterUser.dto");
let SubscribersController = class SubscribersController {
    constructor(subscribersService) {
        this.subscribersService = subscribersService;
    }
    create(authUser, dto) {
        return this.subscribersService.create(authUser, dto);
    }
    findAll(query) {
        return this.subscribersService.findAll(query);
    }
    findDetails(id) {
        return this.subscribersService.findDetails(id);
    }
    findOne(id) {
        return this.subscribersService.findOne(id);
    }
    update(id, dto) {
        return this.subscribersService.update(id, dto);
    }
    remove(id) {
        return this.subscribersService.remove(id);
    }
};
exports.SubscribersController = SubscribersController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, authUser_1.AuthUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_subscriber_dto_1.CreateSubscriberDto]),
    __metadata("design:returntype", void 0)
], SubscribersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filterUser_dto_1.FilterUserDto]),
    __metadata("design:returntype", void 0)
], SubscribersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id/details'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SubscribersController.prototype, "findDetails", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SubscribersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_subscriber_dto_1.UpdateSubscriberDto]),
    __metadata("design:returntype", void 0)
], SubscribersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SubscribersController.prototype, "remove", null);
exports.SubscribersController = SubscribersController = __decorate([
    (0, common_1.Controller)('subscribers'),
    (0, swagger_1.ApiTags)('Subscribers'),
    (0, swagger_1.ApiBearerAuth)('Token'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, authGuardPermisssion_1.AuthGuardPermissions)({ allowedUsers: [auth_type_1.UserType.ADMIN] }),
    __metadata("design:paramtypes", [subscribers_service_1.SubscribersService])
], SubscribersController);
//# sourceMappingURL=subscribers.controller.js.map
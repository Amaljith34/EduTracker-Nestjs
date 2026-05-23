"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthGuardPermissions = exports.AuthGuardPermissionMetadataKey = void 0;
const common_1 = require("@nestjs/common");
exports.AuthGuardPermissionMetadataKey = 'authPermissions';
const AuthGuardPermissions = (permissions) => (0, common_1.SetMetadata)(exports.AuthGuardPermissionMetadataKey, {
    userRequired: permissions?.userRequired ?? true,
    allowedUsers: permissions?.allowedUsers ?? [],
});
exports.AuthGuardPermissions = AuthGuardPermissions;
//# sourceMappingURL=authGuardPermisssion.js.map
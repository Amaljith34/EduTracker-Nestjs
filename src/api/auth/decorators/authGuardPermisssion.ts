import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { IAuthPermissions } from '../auth.interface';

export const AuthGuardPermissionMetadataKey = 'authPermissions';

export const AuthGuardPermissions = (
  permissions?: IAuthPermissions,
): CustomDecorator<string> =>
  SetMetadata(AuthGuardPermissionMetadataKey, {
    userRequired: permissions?.userRequired ?? true,
    allowedUsers: permissions?.allowedUsers ?? [],
  });

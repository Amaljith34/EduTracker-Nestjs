import { CustomDecorator } from '@nestjs/common';
import { IAuthPermissions } from '../auth.interface';
export declare const AuthGuardPermissionMetadataKey = "authPermissions";
export declare const AuthGuardPermissions: (permissions?: IAuthPermissions) => CustomDecorator<string>;

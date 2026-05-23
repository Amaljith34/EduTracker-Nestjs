import { Model } from 'mongoose';
import { JwTPayloadType } from 'src/api/auth/auth.type';
import { UserDocument } from './schema/user.schema';
export declare class CommonQueryDatabase {
    static authUser(jwtPayload: JwTPayloadType, userModel: Model<UserDocument>): Promise<UserDocument>;
}

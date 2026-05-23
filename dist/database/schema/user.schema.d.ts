import { Document, Types } from 'mongoose';
import { UserType } from 'src/api/auth/auth.type';
import { DBStatus } from '../types';
import { UserSubject } from './user-subject.schema';
export type UserDocument = User & Document;
export declare class User {
    email: string;
    fullName: string;
    phone?: string;
    password: string;
    type: UserType;
    status: DBStatus;
    subscriberId?: Types.ObjectId;
    subscriberIds?: Types.ObjectId[];
    subjects: UserSubject[];
    refreshToken?: string;
    createdBy?: Types.ObjectId;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User, any, {}> & User & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<User> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;

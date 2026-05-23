export declare class UserSubject {
    subjectName: string;
    amountPerHour: number;
}
export declare const UserSubjectSchema: import("mongoose").Schema<UserSubject, import("mongoose").Model<UserSubject, any, any, any, import("mongoose").Document<unknown, any, UserSubject, any, {}> & UserSubject & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, UserSubject, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<UserSubject>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<UserSubject> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;

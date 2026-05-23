"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const dotenv = require("dotenv");
const user_schema_1 = require("./schema/user.schema");
const auth_type_1 = require("../api/auth/auth.type");
const types_1 = require("./types");
const bcrypt = require("bcrypt");
dotenv.config();
async function seed() {
    const uri = process.env.DB_URI;
    if (!uri)
        throw new Error('DB_URI required');
    await mongoose_1.default.connect(uri);
    const UserModel = mongoose_1.default.model(user_schema_1.User.name, user_schema_1.UserSchema);
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@edutracker.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';
    const existing = await UserModel.findOne({ email: adminEmail, type: auth_type_1.UserType.ADMIN });
    if (existing) {
        console.log('Admin already exists:', adminEmail);
    }
    else {
        const hashed = await bcrypt.hash(adminPassword, 12);
        await UserModel.create({
            email: adminEmail,
            fullName: 'System Admin',
            password: hashed,
            type: auth_type_1.UserType.ADMIN,
            status: types_1.DBStatus.ACTIVE,
            subjects: [],
        });
        console.log('Admin created:', adminEmail);
    }
    await mongoose_1.default.disconnect();
    console.log('Seed complete');
}
seed().catch((e) => {
    console.error(e);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map
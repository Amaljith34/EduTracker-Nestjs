/**
 * Run: npx ts-node src/database/seed.ts
 * Or: npm run seed (after adding script)
 */
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { User, UserSchema } from './schema/user.schema';
import { UserType } from '../api/auth/auth.type';
import { DBStatus } from './types';
import * as bcrypt from 'bcrypt';

dotenv.config();

async function seed() {
  const uri = process.env.DB_URI;
  if (!uri) throw new Error('DB_URI required');

  await mongoose.connect(uri);
  const UserModel = mongoose.model(User.name, UserSchema);

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@edutracker.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';

  const existing = await UserModel.findOne({ email: adminEmail, type: UserType.ADMIN });
  if (existing) {
    console.log('Admin already exists:', adminEmail);
  } else {
    const hashed = await bcrypt.hash(adminPassword, 12);
    await UserModel.create({
      email: adminEmail,
      fullName: 'System Admin',
      password: hashed,
      type: UserType.ADMIN,
      status: DBStatus.ACTIVE,
      subjects: [],
    });
    console.log('Admin created:', adminEmail);
  }

  await mongoose.disconnect();
  console.log('Seed complete');
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});

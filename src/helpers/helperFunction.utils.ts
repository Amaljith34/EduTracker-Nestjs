import * as bcrypt from 'bcrypt';
import { IPagination } from 'src/database/types';

export class HelperFunctionUtils {
  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  static async comparePassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static getPaginationParams(data: IPagination): { limit: number; skip: number } {
    const limit = data.limit ?? 10;
    const page = data.page ?? 1;
    return { limit, skip: (page - 1) * limit };
  }
}

import { UnauthorizedException } from '@nestjs/common';
import { FilterQuery, Model, Types, isValidObjectId } from 'mongoose';
import { JwTPayloadType } from 'src/api/auth/auth.type';
import { User, UserDocument } from './schema/user.schema';
import { DBStatus } from './types';

export class CommonQueryDatabase {
  static async authUser(
    jwtPayload: JwTPayloadType,
    userModel: Model<UserDocument>,
  ): Promise<UserDocument> {
    const filters: FilterQuery<User> = { $or: [] };
    const userId = jwtPayload?.sub ?? jwtPayload?.userId;
    const email = jwtPayload?.email;

    if (userId && isValidObjectId(userId)) {
      filters.$or.push({ _id: new Types.ObjectId(userId) });
    }
    if (email) {
      filters.$or.push({ email });
    }

    if (!filters.$or.length) {
      throw new UnauthorizedException('Invalid User');
    }

    const user = await userModel.findOne(filters);
    if (!user || (user?.status && user.status !== DBStatus.ACTIVE)) {
      throw new UnauthorizedException('Invalid User');
    }
    return user;
  }
}

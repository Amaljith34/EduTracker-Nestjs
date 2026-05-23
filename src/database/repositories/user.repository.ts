import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { User, UserDocument } from '../schema/user.schema';
import { UserType } from 'src/api/auth/auth.type';
import { DBStatus } from '../types';
import { getPagination, PaginationQuery } from 'src/helpers/pagination.helper';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  findByEmail(email: string) {
    return this.userModel.findOne({ email }).select('+password +refreshToken');
  }

  findById(id: string) {
    return this.userModel.findById(id);
  }

  findByIdWithRefresh(id: string) {
    return this.userModel.findById(id).select('+refreshToken');
  }

  create(data: Partial<User>) {
    return this.userModel.create(data);
  }

  updateRefreshToken(id: string, token: string | null) {
    return this.userModel.findByIdAndUpdate(id, { refreshToken: token });
  }

  getModel() {
    return this.userModel;
  }

  async findPaginated(
    filter: FilterQuery<UserDocument>,
    query: PaginationQuery,
    search?: string,
  ) {
    const { page, limit, skip, sort } = getPagination(query);
    const mongoFilter: FilterQuery<UserDocument> = { ...filter };

    if (search) {
      mongoFilter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.userModel.find(mongoFilter).sort(sort).skip(skip).limit(limit),
      this.userModel.countDocuments(mongoFilter),
    ]);
    return { data, total, page, limit };
  }

  findEndUsersBySubscriber(subscriberId: string) {
    return this.userModel.find({
      type: UserType.USER,
      subscriberId: new Types.ObjectId(subscriberId),
      status: { $ne: DBStatus.DELETED },
    });
  }

  updateById(id: string, data: Partial<User>) {
    return this.userModel.findByIdAndUpdate(id, data, { new: true });
  }

  softDelete(id: string) {
    return this.userModel.findByIdAndUpdate(id, { status: DBStatus.DELETED });
  }

  countByType(type: UserType, extra: FilterQuery<UserDocument> = {}) {
    return this.userModel.countDocuments({
      type,
      status: { $ne: DBStatus.DELETED },
      ...extra,
    });
  }
}

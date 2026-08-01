import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  FilterQuery,
  Model,
  PopulateOptions,
  QueryOptions,
  isValidObjectId,
  Types,
} from 'mongoose';
import { DBStatus } from './types';
import { User, UserDocument } from './schema/user.schema';
import { JwTPayloadType } from 'src/api/auth/auth.type';

export interface IDatabaseUtils {
  id?: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  model: Model<any, any, {}, {}, any>;
  modelName?: string;
  populate?: string | PopulateOptions | (string | PopulateOptions)[];
  filters?: FilterQuery<any>;
  options?: QueryOptions;
  limit?: number;
}

export class CommonQueryDatabase {
  static async authUser(jwTPayload: JwTPayloadType, userModel: Model<UserDocument>) {
    const filters: FilterQuery<User> = { $or: [] };
    const userId = jwTPayload?.sub ?? jwTPayload?.userId;
    const email = jwTPayload?.email;

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

  static async getCountWithFilters({ model, filters }: IDatabaseUtils) {
    return await model.countDocuments(filters);
  }

  static async findAllWithFilters({
    model,
    modelName,
    populate,
    filters,
    options,
  }: IDatabaseUtils) {
    const data: any[] = populate
      ? await model.find(filters, undefined, options).populate(populate).lean()
      : await model.find(filters, undefined, options);
    return data;
  }

  static async findById({ id, model, modelName, populate }: IDatabaseUtils) {
    if (!this.isObjectId(id))
      throw new BadRequestException(`Invalid id: ${id}.`);
    const data = populate
      ? await model.findById(id).populate(populate)
      : await model.findById(id);

    if (!data)
      throw new NotFoundException(`No ${modelName} found with id ${id}.`);
    return data;
  }

  static isObjectId(id: string) {
    return isValidObjectId(id);
  }

  static getObjectId(id: string) {
    return new Types.ObjectId(id);
  }
}

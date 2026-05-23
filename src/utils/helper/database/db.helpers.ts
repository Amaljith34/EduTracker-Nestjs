import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import {
  FilterQuery,
  Model,
  PopulateOptions,
  QueryOptions,
} from 'mongoose';
import { DataValidator } from 'src/utils/validator/data.validator';
import { IPagination } from 'src/database/types';
import { HelperFunctionUtils } from 'src/helpers/helperFunction.utils';

export interface IFetchById {
  id: string;
  model: Model<any>;
  populate?: string | PopulateOptions | (string | PopulateOptions)[];
  filters?: FilterQuery<any>;
  modelName?: string;
}

export interface IFetchAll {
  model: Model<any>;
  filters?: FilterQuery<any>;
  options?: QueryOptions;
  pagination?: IPagination;
  sort?: Record<string, 1 | -1>;
}

export class DbHelpers {
  static assertObjectId(id: string, label = 'id') {
    if (!DataValidator.isObjectId(id)) {
      throw new BadRequestException(`Invalid ${label}: ${id}`);
    }
  }

  static async findById({
    id,
    model,
    populate,
    filters,
    modelName = 'Record',
  }: IFetchById) {
    this.assertObjectId(id);
    const query = model.findOne({ _id: id, ...filters });
    const data = populate
  ? await query.populate(populate as any)
  : await query;
    if (!data) {
      throw new NotFoundException(`No ${modelName} found with id ${id}.`);
    }
    return data;
  }

  static async findAll({
    model,
    filters,
    options,
    pagination,
    sort,
  }: IFetchAll) {
    const { limit, skip } = HelperFunctionUtils.getPaginationParams(
      pagination ?? {},
    );
    return model.find(filters, undefined, options).sort(sort).limit(limit).skip(skip);
  }

  static monthDateRange(month: number, year: number) {
    const pad = (n: number) => String(n).padStart(2, '0');
    const lastDay = new Date(year, month, 0).getDate();
    return {
      from: `${year}-${pad(month)}-01`,
      to: `${year}-${pad(month)}-${lastDay}`,
    };
  }
}

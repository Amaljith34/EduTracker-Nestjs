import { isValidObjectId } from 'mongoose';

export class DataValidator {
  static isObjectId(id: string): boolean {
    return isValidObjectId(id);
  }
}

import { ConflictException } from '@nestjs/common';
import { FilterQuery, Model, Types } from 'mongoose';
import { UserType } from 'src/api/auth/auth.type';
import { UserDocument } from 'src/database/schema/user.schema';
import { DBStatus } from 'src/database/types';

export type UniquenessCheckOptions = {
  email?: string;
  phone?: string;
  /** When creating an end-user, allow reuse of the parent subscriber's email/phone */
  allowSubscriberId?: string;
  /** Exclude this document id (for updates) */
  excludeId?: string;
  /** Creating a Subscriber vs end User */
  creatingType: UserType.USER | UserType.SUBSCRIBER;
};

/**
 * Ensures email/phone are free among non-deleted records.
 * Soft-deleted matches are allowed (caller may restore or create new).
 * Special rule: a Subscriber's email/phone may be used for a User under that same Subscriber.
 */
export async function assertEmailPhoneAvailable(
  userModel: Model<UserDocument>,
  options: UniquenessCheckOptions,
): Promise<{ softDeletedMatch?: UserDocument }> {
  const email = options.email?.trim().toLowerCase();
  const phone = options.phone?.trim();

  let softDeletedMatch: UserDocument | undefined;

  if (email) {
    const emailFilter: FilterQuery<UserDocument> = { email };
    if (options.excludeId) {
      emailFilter._id = { $ne: new Types.ObjectId(options.excludeId) };
    }

    const matches = await userModel.find(emailFilter);
    for (const match of matches) {
      if (match.status === DBStatus.DELETED) {
        softDeletedMatch = match;
        continue;
      }

      if (
        options.creatingType === UserType.USER &&
        options.allowSubscriberId &&
        match.type === UserType.SUBSCRIBER &&
        match._id.toString() === options.allowSubscriberId
      ) {
        continue;
      }

      throw new ConflictException(
        `Email "${email}" is already in use by an active ${match.type}`,
      );
    }
  }

  if (phone) {
    const phoneFilter: FilterQuery<UserDocument> = { phone };
    if (options.excludeId) {
      phoneFilter._id = { $ne: new Types.ObjectId(options.excludeId) };
    }

    const matches = await userModel.find(phoneFilter);
    for (const match of matches) {
      if (match.status === DBStatus.DELETED) {
        if (!softDeletedMatch) softDeletedMatch = match;
        continue;
      }

      if (
        options.creatingType === UserType.USER &&
        options.allowSubscriberId &&
        match.type === UserType.SUBSCRIBER &&
        match._id.toString() === options.allowSubscriberId
      ) {
        continue;
      }

      throw new ConflictException(
        `Phone "${phone}" is already in use by an active ${match.type}`,
      );
    }
  }

  return { softDeletedMatch };
}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { Review, ReviewSchema } from './schema/review.schema';
import { Transaction, TransactionSchema } from './schema/transaction.schema';
import { UserRepository } from './repositories/user.repository';
import { ReviewRepository } from './repositories/review.repository';
import { TransactionRepository } from './repositories/transaction.repository';

const features = [
  { name: User.name, schema: UserSchema },
  { name: Review.name, schema: ReviewSchema },
  { name: Transaction.name, schema: TransactionSchema },
];

@Module({
  imports: [MongooseModule.forFeature(features)],
  providers: [UserRepository, ReviewRepository, TransactionRepository],
  exports: [
    UserRepository,
    ReviewRepository,
    TransactionRepository,
    MongooseModule.forFeature(features),
  ],
})
export class DatabaseModule {}

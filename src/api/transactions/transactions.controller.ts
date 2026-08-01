import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guard/auth.guard';
import { AuthGuardPermissions } from '../auth/decorators/authGuardPermisssion';
import { AuthUser } from '../auth/decorators/authUser';
import { AuthUserPayload, UserType } from '../auth/auth.type';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { FilterTransactionDto } from './dto/filter-transaction.dto';

@Controller('transactions')
@ApiTags('Transactions')
@ApiBearerAuth('Token')
@UseGuards(AuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @AuthGuardPermissions({ allowedUsers: [UserType.ADMIN, UserType.SUBSCRIBER] })
  create(@AuthUser() authUser: AuthUserPayload, @Body() dto: CreateTransactionDto) {
    return this.transactionsService.create(authUser, dto);
  }

  @Get()
  @AuthGuardPermissions({
    allowedUsers: [UserType.ADMIN, UserType.SUBSCRIBER, UserType.USER],
  })
  findAll(
    @AuthUser() authUser: AuthUserPayload,
    @Query() query: FilterTransactionDto,
  ) {
    return this.transactionsService.findAll(authUser, query);
  }

  @Get('balance/:userId')
  @AuthGuardPermissions({
    allowedUsers: [UserType.ADMIN, UserType.SUBSCRIBER],
  })
  getBalance(
    @AuthUser() authUser: AuthUserPayload,
    @Param('userId') userId: string,
  ) {
    return this.transactionsService.getBalanceForUser(authUser, userId);
  }

  @Patch(':id')
  @AuthGuardPermissions({ allowedUsers: [UserType.ADMIN, UserType.SUBSCRIBER] })
  update(
    @AuthUser() authUser: AuthUserPayload,
    @Param('id') id: string,
    @Body() dto: UpdateTransactionDto,
  ) {
    return this.transactionsService.update(authUser, id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @AuthGuardPermissions({ allowedUsers: [UserType.ADMIN, UserType.SUBSCRIBER] })
  async remove(@AuthUser() authUser: AuthUserPayload, @Param('id') id: string) {
    await this.transactionsService.remove(authUser, id);
  }
}

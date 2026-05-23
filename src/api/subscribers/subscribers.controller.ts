import {
  Body,
  Controller,
  Delete,
  Get,
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
import { SubscribersService } from './subscribers.service';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { FilterUserDto } from '../users/dto/filter-user.dto';

@Controller('subscribers')
@ApiTags('Subscribers')
@ApiBearerAuth('Token')
@UseGuards(AuthGuard)
@AuthGuardPermissions({ allowedUsers: [UserType.ADMIN] })
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) {}

  @Post()
  create(@AuthUser() authUser: AuthUserPayload, @Body() dto: CreateSubscriberDto) {
    return this.subscribersService.create(authUser, dto);
  }

  @Get()
  findAll(@Query() query: FilterUserDto) {
    return this.subscribersService.findAll(query);
  }

  @Get(':id/details')
  findDetails(@Param('id') id: string) {
    return this.subscribersService.findDetails(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subscribersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSubscriberDto) {
    return this.subscribersService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subscribersService.remove(id);
  }
}

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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth('Token')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @AuthGuardPermissions({ allowedUsers: [UserType.ADMIN, UserType.SUBSCRIBER] })
  create(@AuthUser() authUser: AuthUserPayload, @Body() dto: CreateUserDto) {
    return this.usersService.create(authUser, dto);
  }

  @Get()
  @AuthGuardPermissions({ allowedUsers: [UserType.ADMIN, UserType.SUBSCRIBER] })
  findAll(@AuthUser() authUser: AuthUserPayload, @Query() query: FilterUserDto) {
    return this.usersService.findAll(authUser, query);
  }

  @Get(':id')
  @AuthGuardPermissions({
    allowedUsers: [UserType.ADMIN, UserType.SUBSCRIBER, UserType.USER],
  })
  findOne(@AuthUser() authUser: AuthUserPayload, @Param('id') id: string) {
    return this.usersService.findOne(authUser, id);
  }

  @Patch(':id')
  @AuthGuardPermissions({ allowedUsers: [UserType.ADMIN, UserType.SUBSCRIBER] })
  update(
    @AuthUser() authUser: AuthUserPayload,
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.update(authUser, id, dto);
  }

  @Delete(':id')
  @AuthGuardPermissions({ allowedUsers: [UserType.ADMIN, UserType.SUBSCRIBER] })
  remove(@AuthUser() authUser: AuthUserPayload, @Param('id') id: string) {
    return this.usersService.remove(authUser, id);
  }
}

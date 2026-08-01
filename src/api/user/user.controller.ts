import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guard/auth.guard';
import { AuthGuardPermissions } from '../auth/decorators/authGuardPermisssion';
import { AuthUser } from '../auth/decorators/authUser';
import { AuthUserPayload, UserType } from '../auth/auth.type';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { FilterUserDto } from './dto/filterUser.dto';

@Controller('user')
@ApiTags('User')
@ApiBearerAuth('Token')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create')
  @AuthGuardPermissions({ allowedUsers: [UserType.ADMIN, UserType.SUBSCRIBER] })
  create(@AuthUser() authUser: AuthUserPayload, @Body() dto: CreateUserDto) {
    return this.userService.create(authUser, dto);
  }

  @Get('/get/all/admin')
  @AuthGuardPermissions({ allowedUsers: [UserType.ADMIN, UserType.SUBSCRIBER] })
  findAll(@AuthUser() authUser: AuthUserPayload, @Query() query: FilterUserDto) {
    return this.userService.findAll(authUser, query);
  }

  @Get(':id/admin')
  @AuthGuardPermissions({
    allowedUsers: [UserType.ADMIN, UserType.SUBSCRIBER, UserType.USER],
  })
  findOne(@AuthUser() authUser: AuthUserPayload, @Param('id') id: string) {
    return this.userService.findOne(authUser, id);
  }

  @Put(':id/update/admin')
  @AuthGuardPermissions({ allowedUsers: [UserType.ADMIN, UserType.SUBSCRIBER] })
  update(
    @AuthUser() authUser: AuthUserPayload,
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.update(authUser, id, dto);
  }

  @Delete('delete/:id')
  @AuthGuardPermissions({ allowedUsers: [UserType.ADMIN, UserType.SUBSCRIBER] })
  remove(@AuthUser() authUser: AuthUserPayload, @Param('id') id: string) {
    return this.userService.remove(authUser, id);
  }
}

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
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guard/auth.guard';
import { AuthGuardPermissions } from '../auth/decorators/authGuardPermisssion';
import { AuthUser } from '../auth/decorators/authUser';
import { AuthUserPayload, UserType } from '../auth/auth.type';
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@Controller('subjects')
@ApiTags('Subjects')
@ApiBearerAuth('Token')
@UseGuards(AuthGuard)
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post()
  @AuthGuardPermissions({
    allowedUsers: [UserType.ADMIN, UserType.SUBSCRIBER],
  })
  create(@AuthUser() authUser: AuthUserPayload, @Body() dto: CreateSubjectDto) {
    return this.subjectsService.create(authUser, dto);
  }

  @Get()
  @AuthGuardPermissions({
    allowedUsers: [UserType.ADMIN, UserType.SUBSCRIBER, UserType.USER],
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['active', 'hold', 'inactive', 'deleted'],
  })
  findAll(
    @AuthUser() authUser: AuthUserPayload,
    @Query('status') status?: string,
  ) {
    return this.subjectsService.findAll(authUser, status);
  }

  @Get(':id')
  @AuthGuardPermissions({
    allowedUsers: [UserType.ADMIN, UserType.SUBSCRIBER, UserType.USER],
  })
  findOne(@AuthUser() authUser: AuthUserPayload, @Param('id') id: string) {
    return this.subjectsService.findOne(authUser, id);
  }

  @Patch(':id')
  @AuthGuardPermissions({ allowedUsers: [UserType.ADMIN] })
  update(
    @AuthUser() authUser: AuthUserPayload,
    @Param('id') id: string,
    @Body() dto: UpdateSubjectDto,
  ) {
    return this.subjectsService.update(authUser, id, dto);
  }

  @Delete(':id')
  @AuthGuardPermissions({ allowedUsers: [UserType.ADMIN] })
  remove(@AuthUser() authUser: AuthUserPayload, @Param('id') id: string) {
    return this.subjectsService.remove(authUser, id);
  }
}

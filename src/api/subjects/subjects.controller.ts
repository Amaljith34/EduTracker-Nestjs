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
import { UserType } from '../auth/auth.type';
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
  @AuthGuardPermissions({ allowedUsers: [UserType.ADMIN] })
  create(@Body() dto: CreateSubjectDto) {
    return this.subjectsService.create(dto);
  }

  @Get()
  @AuthGuardPermissions({
    allowedUsers: [UserType.ADMIN, UserType.SUBSCRIBER, UserType.USER],
  })
  @ApiQuery({ name: 'status', required: false, enum: ['active', 'inactive'] })
  findAll(@Query('status') status?: string) {
    return this.subjectsService.findAll(status);
  }

  @Get(':id')
  @AuthGuardPermissions({
    allowedUsers: [UserType.ADMIN, UserType.SUBSCRIBER, UserType.USER],
  })
  findOne(@Param('id') id: string) {
    return this.subjectsService.findOne(id);
  }

  @Patch(':id')
  @AuthGuardPermissions({ allowedUsers: [UserType.ADMIN] })
  update(@Param('id') id: string, @Body() dto: UpdateSubjectDto) {
    return this.subjectsService.update(id, dto);
  }

  @Delete(':id')
  @AuthGuardPermissions({ allowedUsers: [UserType.ADMIN] })
  remove(@Param('id') id: string) {
    return this.subjectsService.remove(id);
  }
}

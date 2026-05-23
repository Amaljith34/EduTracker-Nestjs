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
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { FilterReviewDto } from './dto/filter-review.dto';

@Controller('reviews')
@ApiTags('Reviews')
@ApiBearerAuth('Token')
@UseGuards(AuthGuard)
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @AuthGuardPermissions({ allowedUsers: [UserType.ADMIN, UserType.SUBSCRIBER] })
  create(@AuthUser() authUser: AuthUserPayload, @Body() dto: CreateReviewDto) {
    return this.reviewsService.create(authUser, dto);
  }

  @Get()
  @AuthGuardPermissions({
    allowedUsers: [UserType.ADMIN, UserType.SUBSCRIBER, UserType.USER],
  })
  findAll(@AuthUser() authUser: AuthUserPayload, @Query() query: FilterReviewDto) {
    return this.reviewsService.findAll(authUser, query);
  }

  @Patch(':id')
  @AuthGuardPermissions({ allowedUsers: [UserType.ADMIN, UserType.SUBSCRIBER] })
  update(
    @AuthUser() authUser: AuthUserPayload,
    @Param('id') id: string,
    @Body() dto: UpdateReviewDto,
  ) {
    return this.reviewsService.update(authUser, id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @AuthGuardPermissions({ allowedUsers: [UserType.ADMIN, UserType.SUBSCRIBER] })
  async remove(@AuthUser() authUser: AuthUserPayload, @Param('id') id: string) {
    await this.reviewsService.remove(authUser, id);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { JwtService } from '@nestjs/jwt';

@Controller('bookmark')
export class BookmarkController {
  constructor(
    private readonly bookmarkService: BookmarkService,
    private readonly jwtService: JwtService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post(':journeyId')
  async create(@Param('journeyId') journeyId: string, @Request() req) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('token invalid');
    }

    try {
      const decoded = this.jwtService.decode(token) as any;
      const userId = decoded.id;

      return await this.bookmarkService.create(userId, journeyId);
    } catch (error) {
      throw new BadRequestException(
        'Failed to create journey: ' + error.message,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':userId')
  async findAll(@Param('userId') userId: string, @Request() req) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('token invalid');
    }
    try {
      const decoded = this.jwtService.decode(token) as any;
      const userId = decoded.id;
      return await this.bookmarkService.findAll(userId);
    } catch (error) {
      throw new BadRequestException(
        'Failed to create journey: ' + error.message,
      );
    }
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateBookmarkDto: UpdateBookmarkDto,
  // ) {
  //   return this.bookmarkService.update(+id, updateBookmarkDto);
  // }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('token invalid');
    }
    try {
      const decoded = this.jwtService.decode(token) as any;
      const userId = decoded.id;
      return await this.bookmarkService.delete(userId, id);
    } catch (error) {
      throw new BadRequestException(
        'Failed to create journey: ' + error.message,
      );
    }
  }
}

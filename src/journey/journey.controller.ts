import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  UploadedFile,
  BadRequestException,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { JourneyService } from './journey.service';
import { CreateJourneyDto } from './dto/create-journey.dto';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtService } from '@nestjs/jwt';

@Controller('journey')
export class JourneyController {
  constructor(
    private readonly journeyService: JourneyService,
    private readonly jwtService: JwtService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('create-journey')
  @UseInterceptors(FileInterceptor('file')) // Assuming 'file' is the name of the field for the image upload
  async createJourney(
    @Body() createJourneyDto: CreateJourneyDto,
    @Request() req,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('token invalid');
    }

    try {
      const decoded = this.jwtService.decode(token) as any;
      const authorId = decoded.id;

      return this.journeyService.createJourney(
        createJourneyDto,
        image,
        authorId,
      );
    } catch (error) {
      throw new BadRequestException(
        'Failed to create journey: ' + error.message,
      );
    }
  }

  @Get()
  async getAllJourneys() {
    return await this.journeyService.getAllJourneys();
  }

  @Get(':id')
  async getJourneyById(@Param('id') id: string) {
    return this.journeyService.getJourneyById(id);
  }


  @Delete(':id')
  async deleteJourney(@Param('id') id: string) {
    return this.journeyService.deleteJourney(id);
  }
}

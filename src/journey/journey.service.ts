import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateJourneyDto } from './dto/create-journey.dto';
import { PrismaService } from '../prisma/prisma.service';
import cloudinary from '../config/cloudinary';
import * as fs from 'fs';

@Injectable()
export class JourneyService {
  constructor(private prisma: PrismaService) {}
  async getAllJourneys() {
    return this.prisma.journey.findMany();
  }

  async getJourneyById(id: string) {
    return this.prisma.journey.findUnique({
      where: { id },
    });
  }

  async createJourney(
    createDto: CreateJourneyDto,
    file: Express.Multer.File,
    authorId: string,
  ): Promise<any> {
    try {
      let imageUrl: string = createDto.image || '';

      if (file) {
        const filePath = file as unknown as Express.Multer.File;
        console.log('filepath', filePath);

        const cloudinaryUpload = await cloudinary.uploader.upload(
          filePath.path,
          {
            folder: 'profiles',
          },
        );

        imageUrl = cloudinaryUpload.secure_url;
        console.log('imageurl', imageUrl);

        fs.unlinkSync(filePath.path);
      }

      const { title, content } = createDto;

      return await this.prisma.journey.create({
        data: {
          title,
          content,
          published: new Date(),
          image: imageUrl,
          authorId: authorId,
        },
      });
    } catch (error) {
      throw new BadRequestException(
        'Failed to create journey: ' + error.message,
      );
    }
  }


  async deleteJourney(id: string) {
    return this.prisma.journey.delete({
      where: { id },
    });
  }
}

import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateJourneyDto } from './dto/create-journey.dto';
import { PrismaService } from '../prisma/prisma.service';
import cloudinary from '../config/cloudinary';
import * as fs from 'fs';
import { UpdateJourneyDto } from './dto/update-journey.dto';

@Injectable()
export class JourneyService {
  constructor(private prisma: PrismaService) {}
  async getAllJourneys() {
    return this.prisma.journey.findMany({
      include: {
        author: {
          select: {
            fullName: true,
          },
        },
      },
    });
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

  async getJourneyTitle(title: string) {
    return this.prisma.journey.findMany({
      where: {
        title: {
          contains: title,
        },
      },
    });
  }

  async updateJourney(id: string, updateDto: any, file: Express.Multer.File) {
    const findJourney = await this.prisma.journey.findUnique({
      where: { id },
    });
    if (!findJourney) {
      throw new BadRequestException('Journey not found');
    }

    let journeyPhoto: string = findJourney.image || '';

    if (file) {
      const filePath = file as unknown as Express.Multer.File;
      const cloudinaryUpload = await cloudinary.uploader.upload(filePath.path, {
        folder: 'imageurl',
      });
      updateDto.image = cloudinaryUpload.secure_url;
      if (findJourney.image) {
        const publicId = findJourney.image.split('/').pop()?.split('.')[0];
        await cloudinary.uploader.destroy(publicId as string);
      }

      fs.unlinkSync(filePath.path);
    }

    return this.prisma.journey.update({
      where: { id },
      data: {
        title: updateDto?.title,
        content: updateDto?.content,
        image: journeyPhoto,
      },
    });
  }

  async deleteJourney(id: string) {
    return this.prisma.journey.delete({
      where: { id },
    });
  }
}

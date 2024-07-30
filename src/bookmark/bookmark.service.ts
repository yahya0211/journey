import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, journeyId: string) {
    return await this.prisma.bookmark.create({
      data: {
        userId: userId,
        journeyId: journeyId,
      },
    });
  }

  async findAll(userId: string) {
    return await this.prisma.bookmark.findMany({
      where: {
        userId: userId,
      },
    });
  }

  async delete(userId: string, id: string) {
    return await this.prisma.bookmark.deleteMany({
      where: {
        id: id,
        userId: userId,
      },
    });
  }
}

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login.dto';
import cloudinary from '../config/cloudinary';
import * as fs from 'fs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(createAuthDto: CreateAuthDto) {
    const existingUser = await this.prisma.user.count({
      where: {
        email: createAuthDto.email,
      },
    });

    if (existingUser > 0) {
      throw new Error('User already register!');
    }

    const hashedPassword = await bcrypt.hash(createAuthDto.password, 10);

    return this.prisma.user.create({
      data: {
        email: createAuthDto.email,
        fullName: createAuthDto.fullname,
        password: hashedPassword,
        phone: createAuthDto.phone,
        photoProfile: 'https://cdn-icons-png.flaticon.com/128/3177/3177440.png',
      },
    });
  }

  async login(dto: LoginUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!existingUser) {
      throw new NotFoundException();
    }

    const isMatchPassword = await bcrypt.compare(
      dto.password,
      existingUser.password,
    );

    if (!isMatchPassword) {
      throw new Error("Password doesn't match");
    }

    const payload = {
      email: existingUser.email,
      id: existingUser.id,
    };

    return { accessToken: await this.jwtService.sign(payload) };
  }

  async updateUser(
    id: string,
    updateAuthDto: any,
    file: Express.Multer.File,
  ): Promise<any> {
    try {
      const existingUser = await this.prisma.user.findFirst({
        where: { id },
        select: { photoProfile: true },
      });

      if (!existingUser) {
        throw new Error('User not found');
      }

      let photoProfileUrl: string = existingUser.photoProfile || '';

      if (file) {
        const filePath = file as unknown as Express.Multer.File;
        const cloudinaryUpload = await cloudinary.uploader.upload(
          filePath.path,
          {
            folder: 'profiles',
          },
        );

        photoProfileUrl = cloudinaryUpload.secure_url;

        fs.unlinkSync(filePath.path);
      }

      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: {
          fullName: updateAuthDto?.fullname,
          phone: updateAuthDto?.phone,
          photoProfile: photoProfileUrl,
        },
      });

      return updatedUser;
    } catch (error) {
      throw new BadRequestException('Failed to update user: ' + error.message);
    }
  }

  async findAllUser() {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
      },
    });
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseInterceptors,
  BadRequestException,
  UploadedFile,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginUserDto } from './dto/login.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() dto: LoginUserDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  async updateProfileImage(
    @Param('id') id: string,
    @UploadedFile() photoProfile: Express.Multer.File,
    @Body() updateAuthDto: UpdateAuthDto,
  ) {
    if (!photoProfile) {
      throw new BadRequestException('No file uploaded');
    }

    try {
      const updatedUser = await this.authService.updateUser(
        id,
        updateAuthDto,
        photoProfile,
      );

      return {
        message: 'Profile image updated successfully',
        data: updatedUser,
      };
    } catch (error) {
      throw new BadRequestException(
        'Failed to update profile image: ' + error.message,
      );
    }
  }

  @Get()
  async findAllUser() {
    return this.authService.findAllUser();
  }
}

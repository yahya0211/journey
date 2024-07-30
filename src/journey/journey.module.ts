import { Module } from '@nestjs/common';
import { JourneyService } from './journey.service';
import { JourneyController } from './journey.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtStrategy } from '../auth/guards/jwt.strategy';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  imports: [
    PrismaModule,
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = file.originalname.split('.').pop();
          cb(null, `${file.fieldname}-${uniqueSuffix}.${ext}`);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
    JwtModule.register({
      global: true,
      secret: 'journeyApp',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [JourneyController],
  providers: [JourneyService, JwtStrategy],
})
export class JourneyModule {}

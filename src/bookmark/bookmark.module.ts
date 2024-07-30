import { Module } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { BookmarkController } from './bookmark.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../auth/guards/jwt.strategy';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      global: true,
      secret: 'journeyApp',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [BookmarkController],
  providers: [BookmarkService, JwtStrategy],
})
export class BookmarkModule {}

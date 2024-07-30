import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JourneyModule } from './journey/journey.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { ProtectedModule } from './auth/protected.module';

@Module({
  imports: [
    AuthModule,
    JourneyModule,
    BookmarkModule,
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ProtectedModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { S3Module } from './s3/s3.module';
import { AntipixelsModule } from './antipixels/antipixels.module';

@Module({
    imports: [PrismaModule, S3Module, AntipixelsModule],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule { }

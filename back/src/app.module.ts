import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AntipixelsModule } from './antipixels/antipixels.module';
import { S3Module } from '@bucket/bucket/s3.module';
import { DbUserModule } from '@db/db/db-user/db-user.module';

@Module({
    imports: [DbUserModule, S3Module, AntipixelsModule],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule { }

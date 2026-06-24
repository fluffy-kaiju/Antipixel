import { Module } from '@nestjs/common';
import { AntipixelsController } from './antipixels.controller';
import { AntipixelsControllerService } from './antipixelsController.service';
import { AntipixelsModelModule } from '@db/db/antipixels-model/antipixels-model.module';
import { S3Module } from '@bucket/bucket/s3.module';

@Module({
    imports: [
        AntipixelsModelModule,
        S3Module // TODO REMOVE !!!
    ],
    controllers: [AntipixelsController],
    providers: [AntipixelsControllerService],
})
export class AntipixelsModule { }

import { Module } from '@nestjs/common';
import { AntipixelsModelService } from './antipixels-model.service';
import { PrismaModule } from '../prisma/prisma.module';
import { S3AntipixelsModelModule } from '@bucket/bucket/s3-antipixels-model/s3-antipixels-model.module';

@Module({
    imports: [
        PrismaModule,
        S3AntipixelsModelModule,
    ],
    providers: [AntipixelsModelService],
    exports: [AntipixelsModelService],
})
export class AntipixelsModelModule { }

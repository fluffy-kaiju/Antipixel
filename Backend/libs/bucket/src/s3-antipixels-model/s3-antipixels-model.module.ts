import { Module } from '@nestjs/common';
import { S3AntipixelsModelService } from './s3-antipixels-model.service';
import { S3Module } from '../s3.module';

@Module({
    imports: [S3Module],
    providers: [S3AntipixelsModelService],
    exports: [S3AntipixelsModelService],
})
export class S3AntipixelsModelModule {}

import { Module } from '@nestjs/common';
import { AntipixelsService } from './antipixels.service';
import { AntipixelsController } from './antipixels.controller';

@Module({
  controllers: [AntipixelsController],
  providers: [AntipixelsService],
})
export class AntipixelsModule {}

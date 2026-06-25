import { Module } from '@nestjs/common';
import { AntipixelsController } from './antipixels.controller';
import { AntipixelsControllerService } from './antipixelsController.service';
import { AntipixelsModelModule } from '@db/db/antipixels-model/antipixels-model.module';

@Module({
    imports: [
        AntipixelsModelModule,
    ],
    controllers: [AntipixelsController],
    providers: [AntipixelsControllerService],
})
export class AntipixelsModule { }

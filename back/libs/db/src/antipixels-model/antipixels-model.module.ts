import { Module } from '@nestjs/common';
import { AntipixelsModelService } from './antipixels-model.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    providers: [AntipixelsModelService],
})
export class AntipixelsModelModule { }

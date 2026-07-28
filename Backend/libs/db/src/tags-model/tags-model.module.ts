import { Module } from '@nestjs/common';
import { TagsModelService } from './tags-model.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    providers: [TagsModelService],
    exports: [TagsModelService],
})
export class TagsModelModule { }

import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { TagsModelModule } from '@db/db/tags-model/tags-model.module';

@Module({
    controllers: [TagsController],
    providers: [TagsService],
    imports: [TagsModelModule],
})
export class TagsModule { }

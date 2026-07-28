import { Injectable, Logger } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagsModelService } from '@db/db/tags-model/tags-model.service';
import { TagEntity } from './entities/tag.entity';

@Injectable()
export class TagsService {

    private readonly logger = new Logger(TagsService.name);

    constructor(
        private readonly tagsModelService: TagsModelService,
    ) { }

    async create(
        submitterId: number,
        submitterUsername: string,
        tagName: string,
        tagDescription: string,
    ) {
        const res = await this.tagsModelService.create({
            tagName,
            tagDescription,
            userId: submitterId,
            userName: submitterUsername,
        });

        return new TagEntity(res);
    }

    findAll() {
        return `This action returns all tags`;
    }

    findOne(id: number) {
        return `This action returns a #${id} tag`;
    }

    update(id: number, updateTagDto: UpdateTagDto) {
        return `This action updates a #${id} tag`;
    }

    remove(id: number) {
        return `This action removes a #${id} tag`;
    }
}

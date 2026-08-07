import { Injectable, Logger } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagsModelService } from '@db/db/tags-model/tags-model.service';
import { GetAllTagsEntity, TagEntity } from './entities/tag.entity';
import { TagsNotFound } from './dto/get-tag.dto';

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

    async findAll(limit?: number, cursor?: number): Promise<GetAllTagsEntity> {
        const res = await this.tagsModelService.getAll(
            cursor,
            limit,
        );
        const tags = res.map((p) => new TagEntity(p));
        return new GetAllTagsEntity({
            numberOfAntipixels: tags.length,
            cursor: cursor ?? 0,
            pageSize: limit ?? 0,
            tags: tags,
        });

    }

    async getById(id: number) {
        const res = await this.tagsModelService.getById(id);
        if (res === null) {
            throw new TagsNotFound();
        }
        return new TagEntity(res);
    }

    async getByName(name: string) {
        const res = await this.tagsModelService.getByName(name);
        if (res === null) {
            throw new TagsNotFound();
        }
        return new TagEntity(res);
    }

    update(id: number, updateTagDto: UpdateTagDto) {
        return `This action updates a #${id} tag`;
    }

    remove(id: number) {
        return `This action removes a #${id} tag`;
    }
}

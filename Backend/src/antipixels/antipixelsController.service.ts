import { Injectable, Logger } from '@nestjs/common';
import { CreateAntipixelDto, CreateAntipixelEntity } from './dto/create-antipixel.dto';
import {  AddTagToAntiTagsDTO, UpdateAntipixelDto } from './dto/update-antipixel.dto';
import { FileWithHash } from './antipixel-validation-pipe.pipe';
import { AntipixelsModelService } from '@db/db/antipixels-model/antipixels-model.service';
import { AntiNotFound } from './dto/get-antipixel.dto';
import { AddTagsToAntiResponseEntity, AntipixelResponseEntity, RemoveTagsToAntiResponseEntity } from './entities/antipixel.entity';

@Injectable()
export class AntipixelsControllerService {

    private readonly logger = new Logger(AntipixelsControllerService.name);

    constructor(
        private readonly antiModel: AntipixelsModelService,
    ) { }

    async create(
        createAntipixelDto: CreateAntipixelDto,
        file: FileWithHash,
        submitterId: number,
        submitterUserName: string,
    ) {
        const antipixel = await this.antiModel.newAntipixel({
            name: createAntipixelDto.name,
            description: createAntipixelDto.description,
            fileBuffer: file.file.buffer,
            fileMimeType: file.file.mimetype,
            fileShasum256: file.shasum256,
            originalFileName: file.file.originalname,
            submitterId: submitterId,
            submitterUserName: submitterUserName,

        })
        return new CreateAntipixelEntity(antipixel);
    }

    async findAll(limit?: number, offset?: number) {
        const res = await this.antiModel.getAll(
            offset, limit
        );
        return res.map((p) => new AntipixelResponseEntity(p));
    }

    async findOne(id: number) {
        const res = await this.antiModel.getById(id);
        if (res === null) {
            throw new AntiNotFound();
        }
        return new AntipixelResponseEntity(res);
    }

    update(id: number, updateAntipixelDto: UpdateAntipixelDto) {
        return `This action updates a #${id} antipixel`;
    }

    remove(id: number) {
        return `This action removes a #${id} antipixel`;
    }

    async addTags(antiId: number, tagsIds: number[], assignedById: number, assignedByUserName: string) {
        const data = new Map(tagsIds.map(
            (tagId) => ([tagId, {
                antipixelId: antiId,
                userId: assignedById,
            }])));

        const res = await this.antiModel.addTagsBulk(data);
        return new AddTagsToAntiResponseEntity({ failed: res.failed, successfully: res.ok });

    }

    async removeTags(antiId: number, tagsIds: number[], assignedById: number, assignedByUserName: string) {
        const data = new Map(tagsIds.map(
            (tagId) => ([tagId, {
                antipixelId: antiId,
                userId: assignedById,
            }])));

        this.logger.verbose(data);
        const res = await this.antiModel.removeTagsBulk(data);
        this.logger.debug(res);
        return new RemoveTagsToAntiResponseEntity({ failed: res.failed, removed: res.deleted, removed_nb: res.deleted_nb });

    }
}

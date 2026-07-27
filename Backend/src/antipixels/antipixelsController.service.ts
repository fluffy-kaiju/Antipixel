import { Injectable, Logger } from '@nestjs/common';
import { CreateAntipixelDto, CreateAntipixelEntity } from './dto/create-antipixel.dto';
import { UpdateAntipixelDto } from './dto/update-antipixel.dto';
import { FileWithHash } from './antipixel-validation-pipe.pipe';
import { AntipixelsModelService } from '@db/db/antipixels-model/antipixels-model.service';
import { AntiNotFound, AntipixelResponseEntity } from './dto/get-antipixel.dto';

@Injectable()
export class AntipixelsControllerService {

    private readonly logger = new Logger(AntipixelsControllerService.name);

    constructor(
        private readonly antiModel: AntipixelsModelService,
    ) { }

    async create(
        createAntipixelDto: CreateAntipixelDto,
        file: FileWithHash,
        submittedBy: number,
    ) {
        const antipixel = await this.antiModel.newAntipixel({
            name: createAntipixelDto.name,
            description: createAntipixelDto.description,
            fileBuffer: file.file.buffer,
            fileMimeType: file.file.mimetype,
            fileShasum256: file.shasum256,
            originalFileName: file.file.originalname,
            submittedBy: submittedBy // TODO get from the auth decorator
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
}

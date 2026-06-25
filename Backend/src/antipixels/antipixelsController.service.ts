import { Injectable, Logger } from '@nestjs/common';
import { CreateAntipixelDto, CreateAntipixelEntity } from './dto/create-antipixel.dto';
import { UpdateAntipixelDto } from './dto/update-antipixel.dto';
import { FileWithHash } from './antipixel-validation-pipe.pipe';
import { AntipixelsModelService } from '@db/db/antipixels-model/antipixels-model.service';

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

    findAll() {
        return `This action returns all antipixels`;
    }

    findOne(id: number) {
        return `This action returns a #${id} antipixel`;
    }

    update(id: number, updateAntipixelDto: UpdateAntipixelDto) {
        return `This action updates a #${id} antipixel`;
    }

    remove(id: number) {
        return `This action removes a #${id} antipixel`;
    }
}

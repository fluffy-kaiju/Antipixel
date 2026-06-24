import { Injectable, Logger } from '@nestjs/common';
import { CreateAntipixelDto } from './dto/create-antipixel.dto';
import { UpdateAntipixelDto } from './dto/update-antipixel.dto';
import { S3Service } from '@bucket/bucket/s3.service';
import { FileWithHash } from './antipixel-validation-pipe.pipe';

@Injectable()
export class AntipixelsControllerService {

    private readonly logger = new Logger(AntipixelsControllerService.name);

    constructor(
        private readonly s3Service: S3Service,
    ) { }

    async create(
        createAntipixelDto: CreateAntipixelDto,
        file: FileWithHash,
    ) {
        this.logger.log(file.file.buffer);
        await this.s3Service.s3UploadAntipixel(file.file.buffer, file.file.originalname, file.file.mimetype, 12, file.shasum256 /* // TODO remove */);
        return 'This action adds a new antipixel';
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

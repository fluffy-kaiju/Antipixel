import { Injectable, Logger } from '@nestjs/common';
import { CreateAntipixelDto } from './dto/create-antipixel.dto';
import { UpdateAntipixelDto } from './dto/update-antipixel.dto';

@Injectable()
export class AntipixelsControllerService {

    private readonly logger = new Logger(AntipixelsControllerService.name);

    create(
        createAntipixelDto: CreateAntipixelDto,
        file: Express.Multer.File,
    ) {
        this.logger.log(file.filename);
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

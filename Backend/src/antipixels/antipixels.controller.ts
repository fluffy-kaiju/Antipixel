import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { CreateAntipixelDto, CreateAntipixelMaxUploadSize } from './dto/create-antipixel.dto';
import { UpdateAntipixelDto } from './dto/update-antipixel.dto';
import { AntipixelsControllerService } from './antipixelsController.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileHashPipe, FileWithHash } from './antipixel-validation-pipe.pipe';

@Controller('antipixel')
export class AntipixelsController {
    constructor(private readonly antipixelsControllerService: AntipixelsControllerService) { }

    @Post('/upload')
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'List of cats',
        type: CreateAntipixelDto,
    })
    create(
        @Body() createAntipixelDto: CreateAntipixelDto,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({
                        maxSize: CreateAntipixelMaxUploadSize,
                        message: `File exceeds upload limit of ${CreateAntipixelMaxUploadSize} bytes.`
                    }),
                    new FileTypeValidator({
                        fileType: /^image\//, errorMessage(ctx) {
                            if (ctx.file) {
                                return `Unsupported file format ${ctx.file.mimetype}`;
                            }
                            return `File missing`;
                        }
                    }),]
            }),
            FileHashPipe
        ) file: FileWithHash,
    ) {
        return this.antipixelsControllerService.create(createAntipixelDto, file);
    }

    // @Post('/upload/bulk')
    // @UseInterceptors(FileInterceptor('file'))
    // createBulk(@UploadedFile() file: Express.Multer, @Body() createAntipixelDto: CreateAntipixelDto) {
    //     return this.antipixelsControllerService.create(createAntipixelDto);
    // }

    @Get()
    findAll() {
        return this.antipixelsControllerService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.antipixelsControllerService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateAntipixelDto: UpdateAntipixelDto) {
        return this.antipixelsControllerService.update(+id, updateAntipixelDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.antipixelsControllerService.remove(+id);
    }
}

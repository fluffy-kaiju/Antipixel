import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { CreateAntipixelDto } from './dto/create-antipixel.dto';
import { UpdateAntipixelDto } from './dto/update-antipixel.dto';
import { AntipixelsControllerService } from './antipixelsController.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

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
        @UploadedFile() file: Express.Multer.File,
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

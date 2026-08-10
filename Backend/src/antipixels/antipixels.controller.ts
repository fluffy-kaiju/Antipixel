import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Query } from '@nestjs/common';
import { CreateAntipixelDto, CreateAntipixelDuplicateHashException, CreateAntipixelMaxUploadSize, ECreateAntipixelStatus } from './dto/create-antipixel.dto';
import { AddTagsToAntiResponseEntity, AddTagToAntiIdDTO, AddTagToAntiTagsDTO, UpdateAntipixelDto } from './dto/update-antipixel.dto';
import { AntipixelsControllerService } from './antipixelsController.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiAcceptedResponse, ApiBody, ApiConflictResponse, ApiConsumes, ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';
import { FileHashPipe, FileWithHash } from './antipixel-validation-pipe.pipe';
import { AuthUser, Public } from '@auth/auth/auth-user/auth-user.decorator';
import { AntiNotFound, GetAntiAllDto, AntipixelResponseEntity, GetAntiByIdDto } from './dto/get-antipixel.dto';
import { AuthUserTokenEntity } from '@auth/auth/auth-user/dto/AuthUser.dto';

@Controller('antipixel')
export class AntipixelsController {
    constructor(private readonly antipixelsControllerService: AntipixelsControllerService) { }

    @ApiConflictResponse({
        description: 'Antipixel with same hash found, duplicate is skipped',
        type: CreateAntipixelDuplicateHashException,
    })
    @Post('/upload')
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        type: CreateAntipixelDto,
    })
    async create(
        @AuthUser() userData: AuthUserTokenEntity,
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
        return this.antipixelsControllerService.create(createAntipixelDto, file, userData.id, userData.userName);
    }

    // @Post('/upload/bulk')
    // @UseInterceptors(FileInterceptor('file'))
    // createBulk(@UploadedFile() file: Express.Multer, @Body() createAntipixelDto: CreateAntipixelDto) {
    //     return this.antipixelsControllerService.create(createAntipixelDto);
    // }

    @ApiOkResponse({
        description: 'Array of Antipixels',
        type: AntipixelResponseEntity,
        isArray: true,
    })
    @Public()
    @Get()
    async getAll(@Query() getAntipixelPaginationDto: GetAntiAllDto): Promise<AntipixelResponseEntity[]> {
        return await this.antipixelsControllerService.findAll(
            getAntipixelPaginationDto.limit,
            getAntipixelPaginationDto.offset,
        );
    }

    @ApiOkResponse({
        description: 'Array of Antipixels',
        type: AntipixelResponseEntity,
    })
    @ApiNotFoundResponse({
        description: 'Antipixel not found',
        type: AntiNotFound,
    })
    @Get(':id')
    async findOne(@Param() getAntiByIdDto: GetAntiByIdDto): Promise<AntipixelResponseEntity> {
        return await this.antipixelsControllerService.findOne(getAntiByIdDto.id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateAntipixelDto: UpdateAntipixelDto) {
        return this.antipixelsControllerService.update(+id, updateAntipixelDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.antipixelsControllerService.remove(+id);
    }

    @ApiCreatedResponse({
        description: 'Bulk tags assignation',
        type: AddTagsToAntiResponseEntity,
    })
    @Post(':id/tags')
    async addTags(
        @AuthUser() userData: AuthUserTokenEntity,
        @Param() antiIdDto: AddTagToAntiIdDTO,
        @Body() tagsIdsDto: AddTagToAntiTagsDTO,
    ): Promise<AddTagsToAntiResponseEntity> {
        return await this.antipixelsControllerService
            .addTags(antiIdDto.id,
                tagsIdsDto.ids,
                userData.id,
                userData.userName)
    }

}

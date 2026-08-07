import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { AuthUser } from '@auth/auth/auth-user/auth-user.decorator';
import { AuthUserTokenEntity } from '@auth/auth/auth-user/dto/AuthUser.dto';
import { GetAllTagsEntity, TagEntity } from './entities/tag.entity';
import { GetTagByIdDTO, GetTagByNameDTO, GetTagsAllDTO } from './dto/get-tag.dto';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('tags')
export class TagsController {
    constructor(private readonly tagsService: TagsService) { }

    @Post()
    async create(
        @Body() createTagDto: CreateTagDto,
        @AuthUser() userData: AuthUserTokenEntity,
    ): Promise<TagEntity> {
        return await this.tagsService.create(
            userData.id,
            userData.userName,
            createTagDto.tagName,
            createTagDto.description,
        );
    }

    @ApiOkResponse({
        description: 'Array of Tags',
        type: GetAllTagsEntity,
    })
    @Get()
    async findAll(@Query() getAllDto: GetTagsAllDTO): Promise<GetAllTagsEntity> {
        return await this.tagsService.findAll(getAllDto.limit, getAllDto.cursor);
    }

    @Get('/id/:id')
    findById(@Param() getTagByIdDTO: GetTagByIdDTO ) {
        return this.tagsService.getById(getTagByIdDTO.id);
    }

    @Get(':name')
    findByName(@Param() getTagByNameDTO: GetTagByNameDTO ) {
        return this.tagsService.getByName(getTagByNameDTO.name);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
        return this.tagsService.update(+id, updateTagDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.tagsService.remove(+id);
    }
}

import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { AuthUser } from '@auth/auth/auth-user/auth-user.decorator';
import { AuthUserTokenEntity } from '@auth/auth/auth-user/dto/AuthUser.dto';

@Controller('tags')
export class TagsController {
    constructor(private readonly tagsService: TagsService) { }

    @Post()
    async create(
        @Body() createTagDto: CreateTagDto,
        @AuthUser() userData: AuthUserTokenEntity,
    ) {
        return await this.tagsService.create(
            userData.id,
            userData.userName,
            createTagDto.tagName,
            createTagDto.description,
        );
    }

    @Get()
    findAll() {
        return this.tagsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.tagsService.findOne(+id);
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

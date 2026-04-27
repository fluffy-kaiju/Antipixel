import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AntipixelsService } from './antipixels.service';
import { CreateAntipixelDto } from './dto/create-antipixel.dto';
import { UpdateAntipixelDto } from './dto/update-antipixel.dto';

@Controller('antipixels')
export class AntipixelsController {
  constructor(private readonly antipixelsService: AntipixelsService) {}

  @Post()
  create(@Body() createAntipixelDto: CreateAntipixelDto) {
    return this.antipixelsService.create(createAntipixelDto);
  }

  @Get()
  findAll() {
    return this.antipixelsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.antipixelsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAntipixelDto: UpdateAntipixelDto) {
    return this.antipixelsService.update(+id, updateAntipixelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.antipixelsService.remove(+id);
  }
}

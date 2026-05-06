import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateAntipixelDto } from './dto/create-antipixel.dto';
import { UpdateAntipixelDto } from './dto/update-antipixel.dto';
import { AntipixelsControllerService } from './antipixelsController.service';

@Controller('antipixels')
export class AntipixelsController {
  constructor(private readonly antipixelsControllerService: AntipixelsControllerService) {}

  @Post()
  create(@Body() createAntipixelDto: CreateAntipixelDto) {
    return this.antipixelsControllerService.create(createAntipixelDto);
  }

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

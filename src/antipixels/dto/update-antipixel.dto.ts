import { PartialType } from '@nestjs/mapped-types';
import { CreateAntipixelDto } from './create-antipixel.dto';

export class UpdateAntipixelDto extends PartialType(CreateAntipixelDto) {}

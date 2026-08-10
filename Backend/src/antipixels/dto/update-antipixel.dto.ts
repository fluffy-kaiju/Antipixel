import { PartialType } from '@nestjs/mapped-types';
import { CreateAntipixelDto } from './create-antipixel.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsNumber, IsPositive, IsString } from 'class-validator';

export class UpdateAntipixelDto extends PartialType(CreateAntipixelDto) { }

export class AddTagToAntiIdDTO {

    @ApiProperty({
        description: "Antipixel id"
    })
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    id: number;

}

export class AddTagToAntiTagsDTO {

    @ApiProperty({
        description: "Tag id",
    })
    @IsNumber({}, { each: true })
    @IsPositive({ each: true })
    ids: number[];
}


export class RemoveTagToAntiIdDTO {

    @ApiProperty({
        description: "Antipixel id"
    })
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    id: number;

}

export class RemoveTagToAntiTagsDTO {

    @ApiProperty({
        description: "Tag id",
    })
    @IsNumber({}, { each: true })
    @IsPositive({ each: true })
    ids: number[];
}


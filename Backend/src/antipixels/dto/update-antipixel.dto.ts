import { PartialType } from '@nestjs/mapped-types';
import { CreateAntipixelDto } from './create-antipixel.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsNumber, IsPositive } from 'class-validator';

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

export class AddTagsToAntiFailed {

    @ApiProperty({
        description: "Tag id of assignation",
    })
    @Expose()
    tagId: number;

    @ApiProperty({
        description: "Antipixel id"
    })
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    @Expose()
    antipixelId: number;

    @ApiProperty({
        description: "Reason",
    })
    @Expose()
    reason: string;

    constructor(p: Partial<AddTagsToAntiFailed>) {
        Object.assign(this, p);
    }

}

export class AddTagsToAntiSuccess {

    @ApiProperty({
        description: "Tag id of assignation",
    })
    @Expose()
    tagId: number;

    @ApiProperty({
        description: "Antipixel id"
    })
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    @Expose()
    antipixelId: number;

    constructor(p: Partial<AddTagsToAntiSuccess>) {
        Object.assign(this, p);
    }
}

export class AddTagsToAntiResponseEntity {

    @ApiProperty({
        description: "Successfully applied",
        isArray: true,
        type: AddTagsToAntiSuccess,
    })
    @Expose()
    @Type(() => AddTagsToAntiSuccess)
    successfully: AddTagsToAntiSuccess[];


    @ApiProperty({
        description: "Failed assignation",
        isArray: true,
        type: AddTagsToAntiFailed
    })
    @Expose()
    @Type(() => AddTagsToAntiFailed)
    failed: AddTagsToAntiFailed[];

    constructor(p: Partial<AddTagsToAntiResponseEntity>) {
        Object.assign(this, p);
    }
}

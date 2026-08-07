import { NotFoundException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { IsNumber, IsOptional, IsPositive, IsString, Length, Min } from "class-validator";

export class GetTagsAllDTO {

    @ApiProperty({
        description: "Maximum of element to return"
    })
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    @IsOptional()
    limit?: number;

    @ApiProperty({
        description: "Tag id for the cursor"
    })
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    @IsOptional()
    cursor?: number;
}

export class GetTagByIdDTO {

    @ApiProperty({
        description: "Tag id"
    })
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    id: number;

}

export class GetTagByNameDTO {

    @ApiProperty({
        description: "Tag name"
    })
    @IsString()
    name: string;

}

export class TagsNotFound extends NotFoundException {

    @ApiProperty({ description: "Reason", example: "Tag not found" })
    @Expose()
    message: string;

    constructor() {
        super("Tag not found");
    }
}

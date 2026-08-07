import { ConflictException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNumber, IsOptional, IsPositive, IsString, Length } from "class-validator";

export class CreateTagDto {

    @ApiProperty({
        description: "name of the tag",
        example: "animated"
    })
    @IsOptional()
    @IsString()
    @Length(3, 24)
    tagName: string

    @ApiProperty({
        description: "Tag description"
    })
    @IsString()
    description: string

}

export class CreateTagDuplicateException extends ConflictException {

    @Expose()
    @IsString()
    duplicateOfName: string;

    constructor(p: { duplicateOfName: string }) {
        super({
            duplicateOfName: p.duplicateOfName,
        });
        Object.assign(this, p);
    }
}


import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsPositive, IsString, Length } from "class-validator";

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

// export class CreateTagDto {

//     @ApiProperty({
//         description: "id of the antipixel",
//     })
//     @IsPositive()
//     antipixelId: number

//     @ApiProperty({
//         description: "id of the tag",
//     })
//     @IsOptional()
//     @IsPositive()
//     tagId: number

//     @ApiProperty({
//         description: "name of the tag",
//     })
//     @IsOptional()
//     @IsString()
//     @Length(3, 24)
//     tagName: string

//     @ApiProperty({
//         description: "Tag description"
//     })
//     @IsString()
//     description: string,

// }

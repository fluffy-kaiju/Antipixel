import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";

export class CreateAntipixelDto {

    @ApiProperty({
        description: "Name of the antipixel",
    })
    @IsString()
    @Length(3, 24)
    name: string;

    @ApiProperty()
    description: string;

    // Add the file property for Swagger
    @ApiProperty({ type: 'string', format: 'binary' })
    file: Express.Multer.File;
}

import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, Length } from "class-validator";


const mb = 1000000;
export const CreateAntipixelMaxUploadSize = mb * 1.4;

export class CreateAntipixelDto {

    @ApiProperty({
        description: "Name of the antipixel",
    })
    @IsString()
    @Length(3, 24)
    name: string;

    @ApiProperty()
    @IsString()
    description: string;

    // Add the file property for Swagger
    @ApiProperty({ type: 'string', format: 'binary' })
    @IsOptional()
    file: Express.Multer.File;
}

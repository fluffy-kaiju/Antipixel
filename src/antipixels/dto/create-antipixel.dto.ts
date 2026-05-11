import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";

export class CreateAntipixelDto {

    @ApiProperty({
        description: "Name of the antipixel",
    })
    @IsString()
    @Length(3, 24)
    name: string;

}

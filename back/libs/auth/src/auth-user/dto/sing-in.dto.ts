import { IsAlphanumeric, IsString, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SignInDto {

    @ApiProperty({ description: "Unique user name", example: "Keven"})
    @IsAlphanumeric()
    @Length(3, 24)
    userName: string;

    @ApiProperty({ description: "Password", example: "H@ck€z12345" })
    @IsString()
    @Length(8, 32)
    password: string;

}

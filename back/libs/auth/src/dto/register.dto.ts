import { ConflictException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length } from "class-validator";

export enum ERegisterError {
    UserNameTaken   = 'Username already taken',
    EmailTaken      = 'Email already taken',
    UnknownConlfict = 'Unknown error, see logs'
}

export class RegisterDto {

    @ApiProperty({ description: "Unique user name", })
    @IsString()
    @Length(3, 24)
    userName: string;

    @ApiProperty({ description: "Email address" })
    @IsEmail()
    email: string;

    @ApiProperty({ description: "Password" })
    @IsString()
    @Length(8, 32)
    password: string;

}

export class RegisterCreatedResponseDto {

    @ApiProperty({ description: "Unique user name", })
    @IsString()
    @Length(3, 24)
    userName: string;

    @ApiProperty({ description: "Email address" })
    @IsEmail()
    email: string;

}

export class RegisterConflictResponseDto extends ConflictException {
    @ApiProperty({ description: "Reason"})
    message: ERegisterError
}

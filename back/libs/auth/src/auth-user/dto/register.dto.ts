import { ConflictException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsAlphanumeric, IsEmail, IsString, Length } from "class-validator";

export enum ERegisterError {
    UserNameTaken = 'Username already taken',
    EmailTaken = 'Email already taken',
    HashingFailed = 'Failed to hash or verify password',
    UnknownConlfict = 'Unknown error, see logs',
}

export class RegisterDto {

    @ApiProperty({ description: "Unique user name", example: "Keven"})
    @IsAlphanumeric()
    @Length(3, 24)
    userName: string;

    @ApiProperty({ description: "Email address" })
    @IsEmail()
    email: string;

    @ApiProperty({ description: "Password", example: "H@ck€z12345" })
    @IsString()
    @Length(8, 32)
    password: string;

}

export class RegisterCreatedResponseEntity {

    @ApiProperty({ description: "Unique user name", })
    @IsString()
    @Length(3, 24)
    @Expose()
    userName: string;

    @ApiProperty({ description: "Email address" })
    @IsEmail()
    @Expose()
    email: string;

    @ApiProperty({ description: "Email address" })
    @IsEmail()
    @Expose()
    id: number;

    constructor(partial: Partial<RegisterCreatedResponseEntity>) {
        Object.assign(this, partial);
    }
}

export class RegisterConflictResponseDto extends ConflictException {
    @ApiProperty({ description: "Reason" })
    message: ERegisterError
}

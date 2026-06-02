import { IsAlphanumeric, IsBase64, IsJWT, IsString, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { ForbiddenException, UnauthorizedException } from "@nestjs/common";

export class LoginDto {

    @ApiProperty({ description: "Unique user name", example: "Keven" })
    @IsAlphanumeric()
    @Length(3, 24)
    userName: string;

    @ApiProperty({ description: "Password", example: "H@ck€z12345" })
    @IsString()
    @Length(8, 32)
    password: string;

}

export class LoginResponseEntity {

    @ApiProperty({ description: "User token"})
    @IsString()
    @Expose()
    access_token: string;

    constructor(p: Partial<LoginResponseEntity>) {
        Object.assign(this, p)
    }
}

export enum ELoginError {

    LoginFailed = "User dont exist or bad password",
    EmailNotVerified = "Email not verified"

}

export class LoginFailedError extends UnauthorizedException {

    @ApiProperty({ description: "Reason", example: ELoginError.LoginFailed})
    @Expose()
    message: string;

    constructor() {
        super(ELoginError.LoginFailed)
    }

}

export class LoginEmailNotVerifiedError extends ForbiddenException {

    @ApiProperty({ description: "Reason", example: ELoginError.EmailNotVerified })
    @Expose()
    message: string;

    constructor() {
        super(ELoginError.EmailNotVerified)
    }

}

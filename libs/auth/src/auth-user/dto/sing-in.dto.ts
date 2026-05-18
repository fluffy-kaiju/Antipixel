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

    @ApiProperty({ description: "User token", example: "Todo" })
    @IsString()
    @Expose()
    token: string

}

export enum ELoginError {
    LoginFailed = "User dont exist or bad password",
    EmailNotVerified = "Email not verified"
}

export class LoginFailedError extends UnauthorizedException {
    @ApiProperty({ description: "Reason" })
    @Expose()
    message: string = ELoginError.LoginFailed
}


export class LoginEmailNotVerifiedError extends ForbiddenException {
    @ApiProperty({ description: "Reason" })
    @Expose()
    message: string = ELoginError.EmailNotVerified
}

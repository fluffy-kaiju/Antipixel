import { ConflictException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsAlphanumeric, IsEmail, IsEnum, IsJSON, IsJWT, IsString, Length } from "class-validator";

export enum ERegisterError {
    UserNameTaken = 'Username already taken',
    EmailTaken = 'Email already taken',
    HashingFailed = 'Failed to hash or verify password',
    FailedToSendVerificationMail = 'Failed to send the verification mail',
    Unknown = 'Unknown error, see logs',
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

export class RegisterConflictResponseEntity extends ConflictException {
    @ApiProperty({ description: "Reason" })
    message: ERegisterError
}

export class VerifyEmailDto {
    @ApiProperty({description: "Email verification token"})
    @IsJWT()
    token: string
}

export enum EVerifyEmailStatus {
    OK      = 'Verified token',
    EXPIRED = 'Expired token',
    INVALID = 'Invalid token',
}

export class VerifyEmailOkResponseEntity {
    @ApiProperty()
    @IsString()
    @Expose()
    status: string = EVerifyEmailStatus.OK
}

export class VerifyEmailErrorResponseEntity {
    @ApiProperty()
    @IsString()
    @Expose()
    status: string = EVerifyEmailStatus.INVALID
}

export class VerifyEmailExpiredOrNotFoundResponseEntity {
    @ApiProperty()
    @IsString()
    @Expose()
    status: string = EVerifyEmailStatus.EXPIRED
}


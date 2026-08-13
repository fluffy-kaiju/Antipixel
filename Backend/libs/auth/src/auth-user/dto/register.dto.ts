import { TooManyParts } from "@aws-sdk/client-s3";
import { ConflictException, HttpException, HttpStatus, UnauthorizedException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsAlphanumeric, IsAscii, IsEmail, IsEnum, IsJSON, IsJWT, IsString, IsUUID, Length } from "class-validator";

export enum ERegisterError {
    UserNameTaken = 'Username already taken',
    EmailTaken = 'Email already taken',
    HashingFailed = 'Failed to hash or verify password',
    FailedToSendVerificationMail = 'Failed to send the verification mail',
    Unknown = 'Unknown error, see logs',
}

export class RegisterDto {

    @ApiProperty({ description: "Unique user name", example: "Keven" })
    @IsAscii()
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
    @IsAscii()
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
    @ApiProperty({ description: "Email verification token CUID2" })
    @IsString() // WIP No cuid2 decorator aviable!
    token: string
}

export enum EVerifyEmailStatus {
    OK = 'Verified token',
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

export class ResendVerifyEmailDto {

    @ApiProperty({ description: "Email address" })
    @IsEmail()
    email: string;

}

export enum EResendVerifyEmailStatus {

    OK = 'Email sent',
    EmailNotFound = 'Email not found',
    AlreadyVerified = 'Email already verified',

}

export class ResendVerifyEmailResponseEntity {

    @ApiProperty()
    @IsString()
    @Expose()
    status: string = EResendVerifyEmailStatus.OK;

}

export class ResendVerifyEmailNotFound extends UnauthorizedException {

    @ApiProperty({ description: "Reason", example: EResendVerifyEmailStatus.EmailNotFound })
    @Expose()
    message: string;

    constructor() {
        super(EResendVerifyEmailStatus.EmailNotFound)
    }

}

export class ResendVerifyEmailAlreadyVerify extends ConflictException {
    @ApiProperty({ description: "Reason", example: EResendVerifyEmailStatus.AlreadyVerified })

    @Expose()
    message: string;

    constructor() {
        super(EResendVerifyEmailStatus.AlreadyVerified)
    }

}

export class ResendVerifyEmailWait extends HttpException {
    @ApiProperty({ description: 'Number of seconds to wait before retrying', example: 30 })
    @Expose()
    retryAfter_sec: number;

    constructor(coolDown_sec: number) {
        super(
            {
                statusCode: HttpStatus.TOO_MANY_REQUESTS,
                message: `Wait ${coolDown_sec}s before retrying`,
                retryAfter_sec: coolDown_sec,
            },
            HttpStatus.TOO_MANY_REQUESTS
        );
    }
}

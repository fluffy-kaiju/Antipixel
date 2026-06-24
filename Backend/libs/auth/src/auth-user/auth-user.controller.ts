import { Body, Controller, Post, Get, Param, Query, UnauthorizedException, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ELoginError, LoginDto, LoginEmailNotVerifiedError, LoginFailedError, LoginResponseEntity } from './dto/sing-in.dto';
import { ERegisterError, RegisterDto, RegisterCreatedResponseEntity, RegisterConflictResponseEntity, VerifyEmailDto, ResendVerifyEmailDto, ResendVerifyEmailResponseEntity, ResendVerifyEmailNotFound, ResendVerifyEmailWait, ResendVerifyEmailAlreadyVerify } from './dto/register.dto';
import { ApiAcceptedResponse, ApiBadRequestResponse, ApiBearerAuth, ApiConflictResponse, ApiCookieAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiGoneResponse, ApiOkResponse, ApiTooManyRequestsResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthUserService } from './auth-user.service';
import { VerifyEmailErrorResponseEntity, VerifyEmailOkResponseEntity, VerifyEmailExpiredOrNotFoundResponseEntity } from './dto/register.dto';
import { Auth, Public } from './auth-user.decorator';

@Controller('auth')
export class AuthUserController {

    constructor(
        private readonly authUserService: AuthUserService,
    ) { }

    @ApiOkResponse({
        description: "Successfully authenticated the user",
        type: LoginResponseEntity
    })
    @ApiUnauthorizedResponse({
        description: ELoginError.LoginFailed,
        type: LoginFailedError,
    })
    @ApiForbiddenResponse({
        description: ELoginError.EmailNotVerified,
        type: LoginEmailNotVerifiedError,
    })
    @Public()
    @Post("/login")
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: LoginDto): Promise<LoginResponseEntity> {
        // TODO     - check if user
        //          - check if mail verified
        //          - check password hash
        //          - send client token
        return await this.authUserService.loginUser({
            userName: loginDto.userName,
            password: loginDto.password,
        });
    }

    @ApiCreatedResponse({
        description: "Successfully registered user",
        type: RegisterCreatedResponseEntity
    })
    @ApiConflictResponse({
        description: ERegisterError.EmailTaken,
        type: RegisterConflictResponseEntity
    })
    @ApiConflictResponse({
        description: ERegisterError.UserNameTaken,
        type: RegisterConflictResponseEntity
    })
    @Public()
    @Post("/register")
    async register(@Body() registerDto: RegisterDto)
        : Promise<RegisterCreatedResponseEntity> {
        return await this.authUserService.registerUser({
            userName: registerDto.userName,
            email: registerDto.email,
            password: registerDto.password
        })
    }

    @ApiAcceptedResponse({
        description: 'Successfully verified email',
        type: VerifyEmailOkResponseEntity
    })
    @ApiGoneResponse({
        description: 'Verification link expired',
        type: VerifyEmailExpiredOrNotFoundResponseEntity
    })
    @ApiBadRequestResponse({
        description: 'Failed to verify email',
        type: VerifyEmailErrorResponseEntity
    })
    @Public()
    @Post("/email/verify")
    async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto)
        : Promise<
            VerifyEmailOkResponseEntity |
            VerifyEmailExpiredOrNotFoundResponseEntity |
            VerifyEmailErrorResponseEntity> {
        return await this.authUserService.verifyEmail(verifyEmailDto.token);
    }

    @ApiAcceptedResponse({
        description: 'Successfully resent email',
        type: ResendVerifyEmailResponseEntity
    })
    @ApiConflictResponse({
        description: 'Email already verified',
        type: ResendVerifyEmailAlreadyVerify,
})
    @ApiUnauthorizedResponse({
        description: 'Email not found',
        type: ResendVerifyEmailNotFound,
    })
    @ApiTooManyRequestsResponse({
        description: 'Number of seconds to wait before retrying',
        type: ResendVerifyEmailWait,
    })
    @Public()
    @Post('/email/verify/resend')
    async resendVerifyEmail(@Body() resendDto: ResendVerifyEmailDto) {
        return this.authUserService.resendEmailVerify(resendDto.email);
    }

    @Auth()
    @Get("test/:param")
    async test(@Param('param') param) {
        console.log("test")
    }
}

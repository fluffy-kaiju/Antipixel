import { Body, Controller, Post, Get, Param, Query } from '@nestjs/common';
import { SignInDto } from './dto/sing-in.dto';
import { ERegisterError, RegisterDto, RegisterCreatedResponseEntity, RegisterConflictResponseEntity, VerifyEmailDto } from './dto/register.dto';
import { ApiAcceptedResponse, ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse, ApiGoneResponse } from '@nestjs/swagger';
import { AuthUserService } from './auth-user.service';
import { AuthService } from '../auth.service';
import { VerifyEmailErrorResponseEntity, VerifyEmailOkResponseEntity, VerifyEmailExpiredOrNotFoundResponseEntity } from './dto/register.dto';

@Controller('auth')
export class AuthUserController {

    constructor(
        private readonly authUserService: AuthUserService,
        private readonly authService: AuthService
    ) { }

    @Post("/login")
    async login(@Body() signInDto: SignInDto) {
        return "ok"
    }

    @ApiCreatedResponse({ description: "Successfully registered user", type: RegisterCreatedResponseEntity })
    @ApiConflictResponse({ description: ERegisterError.EmailTaken, type: RegisterConflictResponseEntity })
    @ApiConflictResponse({ description: ERegisterError.UserNameTaken, type: RegisterConflictResponseEntity })
    @Post("/register")
    async register(@Body() registerDto: RegisterDto): Promise<RegisterCreatedResponseEntity> {
        const res = await this.authUserService.registerUser({
            userName: registerDto.userName,
            email: registerDto.email,
            password: registerDto.password
        })
        return new RegisterCreatedResponseEntity(res);
    }

    @ApiAcceptedResponse({description: 'Successfully verified email', type: VerifyEmailOkResponseEntity})
    @ApiGoneResponse({description: 'Verification link expired', type: VerifyEmailExpiredOrNotFoundResponseEntity})
    @ApiBadRequestResponse({description: 'Failed to verify email', type: VerifyEmailErrorResponseEntity})
    @Get("/verifyEmail/:token")
    async verifyEmail(@Param() verifyEmailDto: VerifyEmailDto): Promise<VerifyEmailOkResponseEntity | VerifyEmailExpiredOrNotFoundResponseEntity | VerifyEmailErrorResponseEntity> {
        return await this.authUserService.verifyEmail(verifyEmailDto.token);
    }
    // @Get("test/:param")
    // async test(@Param('param') param) {
    // }
}

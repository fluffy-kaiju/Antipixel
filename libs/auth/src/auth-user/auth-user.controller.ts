import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { SignInDto } from './dto/sing-in.dto';
import { ERegisterError, RegisterDto, RegisterCreatedResponseEntity, RegisterConflictResponseDto } from './dto/register.dto';
import { ApiConflictResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { AuthUserService } from './auth-user.service';
import { AuthService } from '../auth.service';

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

    @ApiCreatedResponse({ description: "Successfluffy registered user", type: RegisterCreatedResponseEntity })
    @ApiConflictResponse({ description: ERegisterError.EmailTaken, type: RegisterConflictResponseDto })
    @ApiConflictResponse({ description: ERegisterError.UserNameTaken, type: RegisterConflictResponseDto })
    @Post("/register")
    async register(@Body() registerDto: RegisterDto): Promise<RegisterCreatedResponseEntity> {
        const res = await this.authUserService.registerUser({
            userName: registerDto.userName,
            email: registerDto.email,
            password: registerDto.password
        })
        return new RegisterCreatedResponseEntity(res);
    }

    // @Get("test/:param")
    // async test(@Param('param') param) {
    // }
}

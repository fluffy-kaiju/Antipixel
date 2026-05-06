import { Body, Controller, Post } from '@nestjs/common';
import { SignInDto } from './dto/sing-in.dto';
import { ERegisterError, RegisterDto, RegisterCreatedResponseDto, RegisterConflictResponseDto } from './dto/register.dto';
import { ApiConflictResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { AuthUserService } from './auth-user/auth-user.service';

@Controller('auth')
export class AuthController {

    constructor(private readonly authUserService: AuthUserService) { }

    @Post("/login")
    async login(@Body() signInDto: SignInDto) {
        return "ok"
    }

    @ApiCreatedResponse({ description: "Successfluffy registered user", type: RegisterCreatedResponseDto })
    @ApiConflictResponse({ description: ERegisterError.EmailTaken, type: RegisterConflictResponseDto })
    @ApiConflictResponse({ description: ERegisterError.UserNameTaken, type: RegisterConflictResponseDto })
    @Post("/register")
    async register(@Body() registerDto: RegisterDto): Promise<RegisterCreatedResponseDto> {
        return await this.authUserService.registerUser({
            userName: registerDto.userName,
            email: registerDto.email,
            password: registerDto.password
        })
    }
}

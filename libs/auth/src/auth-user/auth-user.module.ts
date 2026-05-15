import { Module } from '@nestjs/common';
import { AuthUserService } from './auth-user.service';
import { UsersModelModule } from '@db/db/users-model/users-model.module';
import { AuthModule } from '../auth.module';
import { AuthUserController } from './auth-user.controller';
import { AuthUserNotifyService } from './auth-user-notify.service';
import { MailModule, MailService } from '@mail/mail';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { JwtModelModule } from '../jwt/jwt-model.module';

@Module({
    imports: [UsersModelModule, AuthModule, MailModule,
        ConfigModule.forRoot({
            validationSchema: Joi.object({
                JWT_TOKEN_SECRET: Joi.string().min(32) // TODO check jwt secret token recommendation
            })
        }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('SECRET'),
            }),
            inject: [ConfigService],
        }),],
    providers: [AuthUserService, AuthUserNotifyService],
    controllers: [AuthUserController],
    exports: [AuthUserService, AuthUserNotifyService]
})
export class AuthUserModule { }

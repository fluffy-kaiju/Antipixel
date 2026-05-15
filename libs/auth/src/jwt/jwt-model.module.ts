import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { JwtModule } from '@nestjs/jwt';
import { JwtModelService } from './jwt-model.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            validationSchema: Joi.object({
                JWT_TOKEN_SECRET: Joi.string().required().min(32) // TODO check jwt secret token recommendation
            })
        }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.getOrThrow<string>('JWT_TOKEN_SECRET'),
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [JwtModelService],
    exports: [JwtModelService],
})
export class JwtModelModule { }

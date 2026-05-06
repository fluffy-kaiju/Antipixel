import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';
import { AntipixelsModule } from './antipixels/antipixels.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from '@auth/auth';

@Module({
    imports: [
        AntipixelsModule,
        ConfigModule.forRoot({
            validationSchema: Joi.object({
                NODE_ENV: Joi.string()
                    .valid('development', 'production')
                    .default('developement'),
                API_PORT: Joi.number()
                    .port()
                    .default(3000),
            })
        }),
        UsersModule,
        AuthModule
    ],
})
export class AppModule { }

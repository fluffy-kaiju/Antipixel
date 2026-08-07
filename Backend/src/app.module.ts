import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';
import { AntipixelsModule } from './antipixels/antipixels.module';
import { UsersModule } from './users/users.module';
import { AuthUserModule } from '@auth/auth/auth-user/auth-user.module';
import { TagsModule } from './tags/tags.module';

@Module({
    imports: [
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
        AuthUserModule,
        UsersModule,
        AntipixelsModule,
        TagsModule,
    ],
})
export class AppModule { }

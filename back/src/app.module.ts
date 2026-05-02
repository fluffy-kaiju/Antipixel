import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AntipixelsModule } from './antipixels/antipixels.module';
import { S3Module } from '@bucket/bucket/s3.module';
import { DbUserModule } from '@db/db/db-user/db-user.module';
import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        DbUserModule, S3Module, AntipixelsModule,
        ConfigModule.forRoot({
            validationSchema: Joi.object({
                NODE_ENV: Joi.string()
                    .valid('development', 'production')
                    .default('developement'),
                API_PORT: Joi.number()
                    .port()
                    .default(3000),
            })
        })
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule { }

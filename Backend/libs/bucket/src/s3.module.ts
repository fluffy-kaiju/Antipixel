import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot({
            validationSchema: Joi.object({
                S3_ACCESS_KEY_ID: Joi.string().required(),
                S3_SECRET_ACCESSKEY: Joi.string().required(),
                S3_ENDPOINT: Joi.string().required(),
                S3_BUCKET_NAME: Joi.string().required(),
                S3_REGION: Joi.string().required(),
            })
        })
    ],
    providers: [
        S3Service
    ],
    exports: [
        S3Service
    ]
})
export class S3Module { }

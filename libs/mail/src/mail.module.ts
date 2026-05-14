import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
    imports: [
        ConfigModule.forRoot({
            validationSchema: Joi.object({
                MAIL_HOST: Joi.string().hostname(),
                MAIL_PORT: Joi.number().port(),
                MAIL_IS_SECURE: Joi.bool(),
                MAIL_USER: Joi.string(),
                MAIL_PASSWORD: Joi.string(),
                MAIL_FROM_MAIL: Joi.string().email(),
                MAIL_FROM_NAME: Joi.string(),
            })
        }),
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                transport: {

                    host: configService.getOrThrow<string>('MAIL_HOST'),
                    port: configService.getOrThrow<number>('MAIL_PORT'),
                    secure: configService.getOrThrow<boolean>('MAIL_IS_SECURE'),
                    auth: {
                        user: configService.getOrThrow<string>('MAIL_USER'),
                        pass: configService.getOrThrow<string>('MAIL_PASSWORD'),
                    },
                },
                defaults: {
                    from: `"${configService.getOrThrow<string>('MAIL_FROM_NAME')}" <${configService.getOrThrow<string>('MAIL_FROM_EMAIL')}>`
                }

            })
        })
    ],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule { }

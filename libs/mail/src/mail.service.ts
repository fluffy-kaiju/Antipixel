import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService implements OnModuleInit {

    private readonly logger = new Logger(MailService.name);

    constructor(
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService
    ) { }

    async onModuleInit() {
        const transponder = this.mailerService.getTransporter();

        await transponder.verify()
            .then(() => {
                this.logger.verbose(
                    `Successfully connected to the Mail provider (${this.configService.getOrThrow<string>('MAIL_HOST')})`
                );
            })
            .catch((e) => {
                this.logger.fatal(
                    `Failed to connect to the Mail provider (${this.configService.getOrThrow<string>('MAIL_HOST')})`
                );
                throw e;
            })
    }

    async sendMailToUser(to: string, subject: string, text: string) {
        return await this.mailerService.sendMail({
            to,
            subject,
            text,
        })
    }

}

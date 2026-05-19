import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SentMessageInfo } from 'nodemailer';

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
        try {

            const res: SentMessageInfo = await this.mailerService.sendMail({
                to,
                subject,
                text,
            })

            this.logger.debug(`Mail send to: ${to}. ${subject}`);
            this.logger.verbose(text);
            this.logger.verbose(res);
        } catch (e) {
            this.logger.error(e);
        }
    }

}

import { MailService } from '@mail/mail';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthUserNotifyService {

    constructor(
        private readonly mailService: MailService,
    ) { }

    async sendEmailConfirmationURL(email: string, userName: string, token: string) {
        return await this.mailService.sendMailToUser(
            email,
            'Verify your Anipixel Account',
            `Hi ${userName}!
             Please verify your email account with this code: ${token}`
        )
    }
}

import { DbUserService } from '@db/db/db-user/db-user.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    constructor(private dbUser: DbUserService) {}
    async getHello()  {
        return await this.dbUser.getUserById(1);
    }
}

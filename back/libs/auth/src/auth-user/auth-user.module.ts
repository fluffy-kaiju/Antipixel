import { Module } from '@nestjs/common';
import { AuthUserService } from './auth-user.service';
import { UsersModelModule } from '@db/db/users-model/users-model.module';

@Module({
    imports: [UsersModelModule],
    providers: [AuthUserService],
    exports: [AuthUserService]
})
export class AuthUserModule { }

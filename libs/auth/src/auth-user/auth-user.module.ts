import { Module } from '@nestjs/common';
import { AuthUserService } from './auth-user.service';
import { UsersModelModule } from '@db/db/users-model/users-model.module';
import { AuthModule } from '../auth.module';
import { AuthUserController } from './auth-user.controller';

@Module({
    imports: [UsersModelModule, AuthModule],
    providers: [AuthUserService],
    controllers: [AuthUserController],
    exports: [AuthUserService]
})
export class AuthUserModule { }

import { Test, TestingModule } from '@nestjs/testing';
import { AuthUserNotifyService } from './auth-user-notify.service';

describe('AuthUserNotifyService', () => {
  let service: AuthUserNotifyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthUserNotifyService],
    }).compile();

    service = module.get<AuthUserNotifyService>(AuthUserNotifyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

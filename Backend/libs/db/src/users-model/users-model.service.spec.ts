import { Test, TestingModule } from '@nestjs/testing';
import { UserModelService } from './user-model.service';

describe('DbUserService', () => {
  let service: UserModelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserModelService],
    }).compile();

    service = module.get<UserModelService>(UserModelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

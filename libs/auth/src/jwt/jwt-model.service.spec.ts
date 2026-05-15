import { Test, TestingModule } from '@nestjs/testing';
import { JwtModelService } from './jwt.service';

describe('JwtModelService', () => {
  let service: JwtModelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtModelService],
    }).compile();

    service = module.get<JwtModelService>(JwtModelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

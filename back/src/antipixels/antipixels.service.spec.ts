import { Test, TestingModule } from '@nestjs/testing';
import { AntipixelsService } from './antipixels.service';

describe('AntipixelsService', () => {
  let service: AntipixelsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AntipixelsService],
    }).compile();

    service = module.get<AntipixelsService>(AntipixelsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

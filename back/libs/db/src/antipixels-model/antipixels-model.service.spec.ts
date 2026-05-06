import { Test, TestingModule } from '@nestjs/testing';
import { AntipixelsModelService } from './antipixels-model.service';

describe('AntipixelsModelService', () => {
  let service: AntipixelsModelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AntipixelsModelService],
    }).compile();

    service = module.get<AntipixelsModelService>(AntipixelsModelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

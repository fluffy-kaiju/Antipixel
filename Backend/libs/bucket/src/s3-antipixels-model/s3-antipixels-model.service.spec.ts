import { Test, TestingModule } from '@nestjs/testing';
import { S3AntipixelsModelService } from './s3-antipixels-model.service';

describe('S3AntipixelsModelService', () => {
  let service: S3AntipixelsModelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [S3AntipixelsModelService],
    }).compile();

    service = module.get<S3AntipixelsModelService>(S3AntipixelsModelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

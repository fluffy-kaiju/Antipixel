import { Test, TestingModule } from '@nestjs/testing';
import { AntipixelsControllerService } from './antipixelsController.service';

describe('AntipixelsService', () => {
  let service: AntipixelsControllerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AntipixelsControllerService],
    }).compile();

    service = module.get<AntipixelsControllerService>(AntipixelsControllerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

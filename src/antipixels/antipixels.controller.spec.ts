import { Test, TestingModule } from '@nestjs/testing';
import { AntipixelsController } from './antipixels.controller';
import { AntipixelsService } from './antipixels.service';

describe('AntipixelsController', () => {
  let controller: AntipixelsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AntipixelsController],
      providers: [AntipixelsService],
    }).compile();

    controller = module.get<AntipixelsController>(AntipixelsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

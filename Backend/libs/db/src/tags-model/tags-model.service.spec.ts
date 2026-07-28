import { Test, TestingModule } from '@nestjs/testing';
import { TagsModelService } from './tags-model.service';

describe('TagsModelService', () => {
  let service: TagsModelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TagsModelService],
    }).compile();

    service = module.get<TagsModelService>(TagsModelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

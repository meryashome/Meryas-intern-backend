import { Test, TestingModule } from '@nestjs/testing';
import { FreedaysService } from './freedays.service';

describe('FreedaysService', () => {
  let service: FreedaysService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FreedaysService],
    }).compile();

    service = module.get<FreedaysService>(FreedaysService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { FreedaysController } from './freedays.controller';

describe('FreedaysController', () => {
  let controller: FreedaysController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FreedaysController],
    }).compile();

    controller = module.get<FreedaysController>(FreedaysController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { ComercianteController } from './comerciante.controller';

describe('ComercianteController', () => {
  let controller: ComercianteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComercianteController],
    }).compile();

    controller = module.get<ComercianteController>(ComercianteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

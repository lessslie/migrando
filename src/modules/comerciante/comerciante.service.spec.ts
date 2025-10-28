import { Test, TestingModule } from '@nestjs/testing';
import { ComercianteService } from './comerciante.service';

describe('ComercianteService', () => {
  let service: ComercianteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ComercianteService],
    }).compile();

    service = module.get<ComercianteService>(ComercianteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

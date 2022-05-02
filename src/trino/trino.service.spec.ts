import { Test, TestingModule } from '@nestjs/testing';
import { TrinoService } from './trino.service';

describe('TrinoService', () => {
  let service: TrinoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrinoService],
    }).compile();

    service = module.get<TrinoService>(TrinoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

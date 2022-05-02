import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { TrinoService } from './trino/trino.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly trinoService: TrinoService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/trino/getTotalCustomers')
  getTotalCustomers() {
    return this.trinoService.query('select count(*) from minio.tiny.customer');
  }

  @Get('/lambda/test')
  testLambda() {
    return this.appService.processLambda();
  }
}

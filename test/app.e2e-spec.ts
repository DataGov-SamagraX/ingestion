import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { join } from 'path';
import { parse } from 'csv-parse';
import fs = require('fs');
import {
  bufferCount,
  bufferTime,
  from,
  interval,
  map,
  take,
  throttle,
} from 'rxjs';
import * as schemaData from './test.schema.json';
import { SchemaService } from './../src/schema/schema.service';
import { TrinoService } from './../src/trino/trino.service';
import { AppService } from './../src/app.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  jest.setTimeout(1000000);
  let schemaService: SchemaService;
  let appService: AppService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [TrinoService, SchemaService, AppService],
    }).compile();

    app = moduleFixture.createNestApplication();
    schemaService = moduleFixture.get<SchemaService>(SchemaService);
    appService = moduleFixture.get<AppService>(AppService);
    await app.init();
  });

  it('/ (GET)', (done) => {
    const parser = parse({ columns: true, trim: true });
    const start = new Date().getTime();
    const filePath = join(process.cwd(), 'test/test.data.csv');
    const dataStream = fs.createReadStream(filePath, 'utf8');
    const transformations: any[] = [
      {
        body: 'function(data) { return parseInt(data.passenger_count); }',
        name: 'Convert Passenger Count to Integer',
        param: 'passenger_count',
      },
      {
        body: 'function(data) { return parseInt(data.trip_duration); }',
        name: 'Convert Trip Duration to Integer',
        param: 'trip_duration',
      },
      {
        body: 'function(a, b) { return parseInt(data.algebra) + parseInt(data.geo); }',
        name: 'additionOfTwoNumbers',
        param: 'maths',
      },
    ];
    const observable = from(dataStream.pipe(parser)).pipe(
      throttle(() => interval(10)),
    );
    let totalPassengers = 0;
    let totalTrips = 0;
    let rows = [];

    observable.subscribe({
      async next(x: any) {
        totalTrips++;
        for (let i = 0; i < transformations.length; i++) {
          const transformation = transformations[i];
          const transformed = await appService.processLambdaPromise(
            transformation.body,
            x,
          );
          x[transformation.param] = JSON.parse(transformed['result']).response;
        }
        rows.push(x);
        const valid = schemaService.validateData(schemaData, x);
        if (valid) {
          totalPassengers += parseInt(x.passenger_count);
          if (totalTrips % 5 === 0) {
            console.log(new Date().getTime(), totalTrips);
            await schemaService.addBulkData(schemaData, rows);
            rows = [];
          }
        } else {
          throw new Error('Invalid data');
        }
      },
      error(err) {
        console.error('something wrong occurred: ' + err);
      },
      complete() {
        //end time
        const end = new Date().getTime();
        const time = end - start;
        console.log(
          `Total trips: ${totalTrips}`,
          `Total passengers: ${totalPassengers}`,
          `Total time: ${time}`,
        );
        console.log(`Stream speed: ${totalTrips / time} records/ms`);
        done();
      },
    });
  });
});

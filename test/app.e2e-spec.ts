import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { join } from 'path';
import { parse } from 'csv-parse';
import fs = require('fs');
import { from } from 'rxjs';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  jest.setTimeout(1000000);

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', (done) => {
    const parser = parse({ columns: true, trim: true });
    const start = new Date().getTime();
    const filePath = join(process.cwd(), 'test/test.data.csv');
    const dataStream = fs.createReadStream(filePath, 'utf8');
    const observable = from(dataStream.pipe(parser));
    let totalPassengers = 0;
    let totalTrips = 0;
    observable.subscribe({
      next(x: any) {
        totalTrips++;
        totalPassengers += parseInt(x.passenger_count);
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

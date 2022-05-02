import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import presto = require('presto-client');
import { CreateSchemaDto } from 'src/dto/schema.dto';
import { PassThrough } from 'stream';
import lento = require('lento');

@Injectable()
export class TrinoService {
  client: any;

  constructor(private readonly configService: ConfigService) {
    const host = this.configService.get<string>('TRINO_HOST');
    const port = this.configService.get<number>('TRINO_PORT');
    const user = this.configService.get<string>('TRINO_USER');
    console.log({ host, port, user });
    this.client = new presto.Client({ host, port });
  }

  //   async createTableFromSchema(schema: CreateSchemaDto | any) {
  //     console.log({ schema });
  //     this.client.execute({
  //       query: 'select count(*) from minio.tiny.customer',
  //       catalog: 'minio',
  //       schema: 'default',
  //       source: 'nodejs-client',
  //       state: function (error, query_id, stats) {
  //         console.log({ message: 'status changed', id: query_id, stats: stats });
  //       },
  //       columns: function (error, data) {
  //         console.log({ resultColumns: data });
  //       },
  //       data: function (error, data, columns, stats) {
  //         console.log(data);
  //       },
  //       success: function (error, stats) {
  //         console.log({ message: 'success', stats: stats });
  //       },
  //       error: function (error) {
  //         console.log({ message: 'error', error: error });
  //       },
  //     });
  //   }

  async query(sql: string): Promise<any[]> {
    const result: any[] = [];
    const stream = this.queryStream(sql);

    for await (const chunk of stream) {
      result.push(chunk);
    }

    return result;
  }

  queryStream(sql: string): PassThrough {
    const stream = new PassThrough({ objectMode: true });
    const onData = (
      error: any,
      data: any[][],
      columns: { name: string }[],
    ): void => {
      if (error) {
        return;
      }

      for (const row of data) {
        stream.write(
          Object.fromEntries(columns.map((c, i) => [c.name, row[i]])),
        );
      }
    };
    const onDone = (error: any): void => {
      if (error) {
        console.error(error);
        stream.destroy(error);
      }

      stream.end();
    };

    this.client.execute({
      query: sql,
      data: onData,
      callback: onDone,
    });

    return stream;
  }
}

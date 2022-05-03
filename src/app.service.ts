import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { Observable } from 'rxjs';
import { LambdaService } from './lambda.interface';

@Injectable()
export class AppService implements OnModuleInit {
  @Client({
    transport: Transport.GRPC,
    options: {
      url: 'air.server:50052',
      package: 'lambda',
      protoPath: join(__dirname, 'proto/lambda.proto'),
      loader: {
        keepCase: true,
        enums: String,
        oneofs: true,
        arrays: true,
        objects: true,
      },
    },
  })
  client: ClientGrpc;

  private lambdaService: any;

  onModuleInit() {
    console.log('onModuleInit');
    this.lambdaService = this.client.getService<LambdaService>('LambdaService');
  }

  processLambda(body: string, data: any): Observable<string> {
    return this.lambdaService.process({
      body,
      language: 'JAVASCRIPT',
      testData: JSON.stringify(data),
    });
  }

  processLambdaPromise(body: string, data: any): Promise<string> {
    return this.lambdaService
      .process({
        body,
        language: 'JAVASCRIPT',
        testData: JSON.stringify(data),
      })
      .toPromise();
  }

  getHello(): string {
    return 'Hello World!';
  }
}

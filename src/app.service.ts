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

  processLambda(): Observable<string> {
    return this.lambdaService.process({
      body: 'function(data) { return `Hello ${data.name}!`; }',
      language: 'JAVASCRIPT',
      testData: '{"name":"Chakshu","task":"shave yaks"}',
    });
  }

  getHello(): string {
    return 'Hello World!';
  }
}

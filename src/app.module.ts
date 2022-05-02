import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DBService } from './lowdb/lowdb.service';
import { TrinoService } from './trino/trino.service';
import { SchemaService } from './schema/schema.service';
import { SchemaController } from './schema/schema.controller';
import { Transport, ClientsModule } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    ClientsModule.register([
      {
        name: 'lambda',
        transport: Transport.GRPC,
        options: {
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
      },
    ]),
  ],
  controllers: [AppController, SchemaController],
  providers: [AppService, DBService, TrinoService, SchemaService],
})
export class AppModule {}

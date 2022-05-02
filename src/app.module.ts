import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DBService } from './lowdb/lowdb.service';
import { TrinoService } from './trino/trino.service';
import { SchemaService } from './schema/schema.service';
import { SchemaController } from './schema/schema.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
  ],
  controllers: [AppController, SchemaController],
  providers: [AppService, DBService, TrinoService, SchemaService],
})
export class AppModule {}

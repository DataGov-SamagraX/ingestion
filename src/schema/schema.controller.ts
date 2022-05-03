import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { DBService } from '../lowdb/lowdb.service';
import { SchemaService } from './schema.service';

@Controller({
  path: 'schema',
})
export class SchemaController {
  constructor(
    private readonly dbService: DBService,
    private readonly schemaService: SchemaService,
  ) {}

  @Get(':id')
  getSchemaById(@Param('id') id: string) {
    return this.dbService.getSchemaDataById(id);
  }

  @Post()
  createSchema(@Body() schemaData: any) {
    this.schemaService.add(schemaData);
    const id = this.dbService.addSchemaData(schemaData);
    return { id };
  }

  @Delete()
  deleteSchema(id: string) {
    return this.dbService.removeSchemaDataById(id);
  }
}

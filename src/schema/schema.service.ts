import { Injectable } from '@nestjs/common';
import { DBService } from '../lowdb/lowdb.service';

@Injectable()
export class SchemaService {
  constructor(private readonly dbService: DBService) {}
}

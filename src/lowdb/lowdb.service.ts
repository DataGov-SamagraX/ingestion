import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { join } from 'path';
import * as db from './db.json';
import * as fs from 'fs';

@Injectable()
export class DBService {
  db: any;

  constructor() {
    this.db = db;
  }

  getDbFileName() {
    return join(__dirname, 'db.json');
  }

  addSchemaData(data: any): string {
    const id = uuidv4();
    this.db.schema[id] = data;
    fs.writeFileSync(this.getDbFileName(), JSON.stringify(this.db));
    return id;
  }

  addDBData(data: any): string {
    const id = uuidv4();
    this.db.db[id] = data;
    fs.writeFileSync(this.getDbFileName(), JSON.stringify(this.db));
    return id;
  }

  removeDBDataById(id: string) {
    delete this.db.db[id];
    fs.writeFileSync(this.getDbFileName(), JSON.stringify(this.db));
  }

  removeSchemaDataById(id: string) {
    delete db.schema[id];
    fs.writeFileSync(this.getDbFileName(), JSON.stringify(this.db));
  }

  getSchemaDataById(id: string) {
    return this.db.schema[id];
  }

  getDbDataById(id: string) {
    return this.db.db[id];
  }
}

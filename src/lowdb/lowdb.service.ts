import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { join } from 'path';
import * as db from './db.json';
import fs from 'fs';

@Injectable()
export class DBService {
  db: any;

  constructor() {
    this.db = db;
  }

  getDbFileName() {
    return join(__dirname, 'lowdb/db.json');
  }

  addSchemaData(data: any) {
    const id = uuidv4();
    this.db.schema.push({ [id]: data });
    fs.writeFileSync(this.getDbFileName(), JSON.stringify(this.db));
  }

  addDBData(data: any) {
    const id = uuidv4();
    this.db.db.push({ [id]: data });
    fs.writeFileSync(this.getDbFileName(), JSON.stringify(this.db));
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

import { Injectable } from '@nestjs/common';
import { DBService } from '../lowdb/lowdb.service';
import { TrinoService } from '../trino/trino.service';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

@Injectable()
export class SchemaService {
  validator: Ajv;
  constructor(private readonly trino: TrinoService) {
    this.validator = new Ajv();
    addFormats(this.validator);
    this.validator.addFormat('integer', /^[0-9]*$/);
  }

  getSQLDataTypeForJSONSchemaType(type: string): string {
    if (type === 'string') {
      return 'VARCHAR(255)';
    }
    if (type === 'integer') {
      return 'INTEGER';
    }
  }

  cleanSQLString(str: string): string {
    return str
      .replace(/'/g, '') // remove single quotes
      .replace(/(?:\r\n|\r|\n)/g, '') // remove new lines
      .replace(/ +(?= )/g, ''); // remove spaces
  }

  generateSQLForSchemaInsert(schemaData: any): string {
    // generate SQL insert statement from testSchema.definition.definitions
    // iterate over testSchema.definition.definitions[tableName]
    const tableName = schemaData.table;
    const properties = schemaData.definition.definitions[tableName].properties;
    const fields = Object.keys(properties).map(
      (key) =>
        `${key} ${this.getSQLDataTypeForJSONSchemaType(properties[key].type)}`,
    );
    let createTableQuery = `CREATE TABLE minio.tiny.${tableName} (
       ${fields.join(', ')}
      )`;
    createTableQuery = this.cleanSQLString(createTableQuery);
    return createTableQuery;
  }

  generateDropTableQuery(tableName: string): string {
    return `DROP TABLE IF EXISTS minio.tiny.${tableName}`;
  }

  generateInsertQuery(tableName: string, data: any): string {
    const fields = Object.keys(data);
    const values = fields.map((key) => `'${data[key]}'`);
    const insertQuery = `INSERT INTO minio.tiny.${tableName} (${fields.join(
      ', ',
    )}) VALUES (${values.join(', ')})`;
    return insertQuery;
  }

  generateBulkInsertQuery(schemaData: any, data: any[]): string {
    const fields = Object.keys(data[0]);
    const tableName = schemaData.table;
    const properties = schemaData.definition.definitions[tableName].properties;
    const values = data.map((row) => {
        const rowValues = fields.map((key) => {
          if (properties[key].type === 'integer') {
            return row[key];
          } else {
            return `'${row[key]}'`;
          }
        });
        return `(${rowValues.join(', ')})`;
      }),
      insertQuery = `INSERT INTO minio.tiny.${schemaData.table} (${fields.join(
        ', ',
      )}) VALUES ${values.join(', ')}`;
    return insertQuery;
  }

  validateData(schemaData: any, data: any | any[]): boolean {
    // ajv validate on schemaData.definition
    const validate = this.validator.compile(
      schemaData.definition.definitions[schemaData.table],
    );
    let isValid = true;
    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        isValid = isValid && validate(data[i]);
      }
    } else {
      isValid = validate(data);
    }
    return isValid;
  }

  async add(schemaData: any): Promise<any> {
    await this.trino.query(this.generateDropTableQuery(schemaData.table));
    await this.trino.query(this.generateSQLForSchemaInsert(schemaData));
  }

  async addData(schemaData: any, data: any): Promise<any> {
    const insertQuery = this.generateInsertQuery(schemaData.table, data);
    await this.trino.query(insertQuery);
  }

  async addBulkData(schemaData: any, data: any[]): Promise<any> {
    const insertQuery = this.generateBulkInsertQuery(schemaData, data);
    console.log({ insertQuery });
    await this.trino.query(insertQuery);
  }
}

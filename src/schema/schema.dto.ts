import { AnonymizationDto } from '../dto/anonymyzation.dto';

enum field {
  integer = 'integer',
  int32 = 'int32', //number
  int64 = 'int64', //number
  float = 'float', //number
  double = 'double', //number
  string = 'string', //string
  boolean = 'boolean',
  date = 'date',
  dateTime = 'dateTime',
  byte = 'byte',
  binary = 'binary',
  nullable = 'nullable',
}

type Property = {
  name: string;
  type: field;
  nullable?: boolean | true;
};

/*
{
    "dbs":  ["db1", "db2"],
    "table": "student",
    "rollups": [{
             "db": "db1",
             "rollups": [{
                 "R1": {
                   "type": "timestamp",
                   "bucket": "Weekly"
                 },
                 "R2": {"type": "brin", "columns": ["field1"]},
                 "R3": {"type": "GIN", "columns": ["field2", "field3"]},
             }]
            
    }],
    "anonymization": {
         "config": {}
    }
}*/

export class CreateSchemaDto {
  tableName: string;
  description: string;
  schema: Property[];
  dbs: string[];
  rollups: {
    db: string;
    rollups: {
      [key: string]: {
        type: string;
        bucket: string;
      };
    };
  }[];
  anonymization: AnonymizationDto;

  created?: Date;
  updated?: Date;
}

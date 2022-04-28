/*
{
    "config": {
        "transformation": [
            {
                "field": "name",
                "transformer": "ReplaceWithUUID" //oneWay hash, twoWay hash
            },
            {
                "field": "phoneNo",
                "transformer": "ReplaceWithNull"
            },
            {
                "field": "aadhaar",
                "transformer": "Remove"
            }
        ]
    }
}
*/

export class AnonymizationDto {
  created?: Date;
  updated?: Date;

  config: {
    transformation: {
      field: string;
      transformer: string;
    }[];
  };
}

/*{
    "schema": "sID"
    "data": {
           "class": 1,
           "School": "school1",
     },
    "transformations": [
        "transformer1", //happens on whole data object
        "transformer2",
    ]
}*/

export class CreateDataDto {
  schema: string;
  data: any;
  transformations: string[];
}

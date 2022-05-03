## Testing/Benchmarking Notes

The test data is taken from [kaggle](https://www.kaggle.com/competitions/nyc-taxi-trip-duration/data?select=train.zip)

### Fields for Test Data

id - a unique identifier for each trip
vendor_id - a code indicating the provider associated with the trip record
pickup_datetime - date and time when the meter was engaged
dropoff_datetime - date and time when the meter was disengaged
passenger_count - the number of passengers in the vehicle (driver entered value)
pickup_longitude - the longitude where the meter was engaged
pickup_latitude - the latitude where the meter was engaged
dropoff_longitude - the longitude where the meter was disengaged
dropoff_latitude - the latitude where the meter was disengaged
store_and_fwd_flag - This flag indicates whether the trip record was held in vehicle memory before sending to the vendor because the vehicle did not have a connection to the server - Y=store and forward; N=not a store and forward trip
trip_duration - duration of the trip in seconds

Sample data shown below

```json
{
  "id": "id2875421",
  "vendor_id": "2",
  "pickup_datetime": "2016-03-14 17:24:55",
  "dropoff_datetime": "2016-03-14 17:32:30",
  "passenger_count": "1",
  "pickup_longitude": "-73.982154846191406",
  "pickup_latitude": "40.767936706542969",
  "dropoff_longitude": "-73.964630126953125",
  "dropoff_latitude": "40.765602111816406",
  "store_and_fwd_flag": "N",
  "trip_duration": "455",
  "geo": 1,
  "algebra": 21
}
```

### What are we testing?

1. Adding a schema to DB
2. Adding data to DB
3. Benchmarking the performance of the streaming inserts.

```

```

# SRS
Simple Rest Service - Just messing around building something from scratch in NodeJS instead of using the existing frameworks.

1. Step one:   https://github.com/smencer/SRS/tree/q1
1. Step two:   https://github.com/smencer/SRS/tree/q2
1. Step three: https://github.com/smencer/SRS/tree/q3

To run this project, clone the repository. No need to npm install... this uses nothing but native modules.

To log in, use the credentials admin/password - this will generate a token you must append to all further requests.

POST:
/login
post body example: user=admin&password=password

Returns JSON response with a token to use with further requests and stores the token in session

POST
/logout
post body example: token=<secure token>

Removes the token from active status

GET:
/config?token=<auth token>
/config?sort=<name|port|username>&token=<auth token> //sorted by a property
/config?start=<start index>&token=<auth token> //get from a starting index, using default pageSize
/config?start=<start index>&pageSize=<page size>&token=<auth token> //get from a starting index, using specific pageSize
/config?sort=<name|port|username>&token=<auth token> //sorted by a property
/config?sort=<name|port|username>&start=<start index>&token=<auth token> //sort by property, then get from a starting index, using default pageSize
/config?sort=<name|port|username>&start=<start index>&pageSize=<page size>&token=<auth token> //sort by property, then get from a starting index, using specific pageSize

Returns a list of objects from the data store with optional sort and paging

POST:
/config?token=<auth token>
post body example: {name: "name", hostname: "hostname", port: 1234, username: "admin"}

Adds a new object to the data store

PUT
/config?name=<model name>&token=<auth token>
post body example: {name: "name", hostname: "hostname", port: 1234, username: "admin"}

Update an existing record, name query string key must match posted model name. Returns 404 if model name is not found.

DELETE
/config?name=<model name>&token=<auth token>

Delete an existing record. Returns 404 if model name is not found.

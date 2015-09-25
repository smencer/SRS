# SRS
Simple Rest Service - Just messing around building something from scratch in NodeJS instead of using the existing frameworks.

## Stages
1. Step one:   https://github.com/smencer/SRS/tree/q1
1. Step two:   https://github.com/smencer/SRS/tree/q2
1. Step three: https://github.com/smencer/SRS/tree/q3

## Setup

To run this project, clone the repository. No need to npm install... this uses nothing but native modules.

To log in, use the credentials admin/password - this will generate a token you must append to all further requests.

## Operations in this REST API

Operation: POST

URL: /login

post body example: user=admin&password=password

Description: Returns JSON response with a token to use with further requests and stores the token in session

***

Operation: POST

URL: /logout

post body example: token=<secure token>

Description: Removes the token from active status

***

Operation: GET
URL(s):

/config?token=<auth token>
/config?sort=<name|port|username>&token=<auth token> //sorted by a property
/config?start=<start index>&token=<auth token> //get from a starting index, using default pageSize
/config?start=<start index>&pageSize=<page size>&token=<auth token> //get from a starting index, using specific pageSize
/config?sort=<name|port|username>&token=<auth token> //sorted by a property
/config?sort=<name|port|username>&start=<start index>&token=<auth token> //sort by property, then get from a starting index, using default pageSize
/config?sort=<name|port|username>&start=<start index>&pageSize=<page size>&token=<auth token> //sort by property, then get from a starting index, using specific pageSize

Description: Returns a list of objects from the data store with optional sort and paging

***

Operation: POST

URL: /config?token=<auth token>

post body example: {name: "name", hostname: "hostname", port: 1234, username: "admin"}

Description: Adds a new object to the data store

***

Operation: PUT

URL: /config?name=<model name>&token=<auth token>

post body example: {name: "name", hostname: "hostname", port: 1234, username: "admin"}

Description: Update an existing record, name query string key must match posted model name. Returns 404 if model name is not found.

***

Operation: DELETE

URL: /config?name=<model name>&token=<auth token>

post body example: n/a

Description: Delete an existing record. Returns 404 if model name is not found.

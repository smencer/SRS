var fs = require('fs');

var wrapped = {
    configurations: []
}

var userNames = [
    'admin',
    'test',
    'user',
    'bender',
    'fry',
    'homer',
    'bart',
    'kenny',
    'cartman',
    'rick',
    'morty'
];

function randomPortNumber(){
    return Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
}

function randomUserName(){
    return userNames[Math.floor(Math.random() * userNames.length)];
}

for(var i = 1; i < 101; i++){
    wrapped.configurations.push({
        name: 'host' + i,
        hostname: 'subdomain' + i + '.fake.com',
        port: randomPortNumber(),
        username: randomUserName()
    });
}

var data = JSON.stringify(wrapped);
fs.writeFileSync('./configStore.json', data);
process.exit(0);

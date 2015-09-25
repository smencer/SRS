var fs = require('fs');

var configStore = {
    init: function(){
        try {
            this._internalStore = require('../configStore.json').configurations;
            console.log(this._internalStore);
            var tempInternalIndex = {};
            this._internalStore.forEach(function(record, index){
                tempInternalIndex[record.name] = index;
            });
            this._internalIndex = tempInternalIndex;
            console.log('Loaded configStore.json from disk, initialized with ' + this._internalStore.length + ' config records');
        } catch (e) {
            console.log(e.message);
            console.log('Unable to load configStore.json from disk, using empty configStore');
            this._internalStore = [];
            this._internalIndex = {};
        }
    },
    createOrUpdateModel: function(configModel){
        if(this._internalIndex.hasOwnProperty(configModel.name)){
            this._internalStore[this._internalIndex[configModel.name]] = configModel;
        } else {
            var newIndex = this._internalStore.push(configModel);
            this._internalIndex[configModel.name] = newIndex;
        }
    },
    deleteModel: function(configName){
        if(this._internalIndex.hasOwnProperty(configName)){
            var index = this._internalIndex[configName];
            this._internalStore.splice(index, 1);
            delete this._internalIndex[configName];
        }
    },
    fetchModel: function(configName){
        if(configName) {
            if(this._internalIndex.hasOwnProperty(configName)){
                var result = this._internalStore[this._internalIndex[configName]];
                return {
                    configurations: [ result ]
                };
            } else {
                return null;
            }
        } else {
            return {
                configurations: this._internalStore
            };
        }
    }
};

process.on('SIGINT', function(){
    var wrapped = { configurations: configStore._internalStore };
    var data = JSON.stringify(wrapped);
    fs.writeFileSync('./configStore.json', data);
    console.log('config datastore persisted');
    process.exit(0);
});

module.exports = configStore;

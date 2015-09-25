var fs = require('fs');

var defaultPageSize = 5;

function getPaged(values, start, pageSize){
    var start = parseInt(start);
    if(pageSize){
        var pageSize = parseInt(pageSize);
        console.log('using pageSize: ' + pageSize);
        values = values.slice(start, start + pageSize);
        console.log('local array size after slice: ' + values.length);
    } else {
        console.log('using pageSize: ' + defaultPageSize);
        values = values.slice(query.start, start + defaultPageSize);
        console.log('local array size after slice: ' + values.length);
    }

    return values;
}

var configStore = {
    init: function(){
        try {
            this._internalStore = require('../configStore.json').configurations;
            var tempInternalIndex = {};
            this._internalStore.forEach(function(record, index){
                tempInternalIndex[record.name] = index;
            });
            this._internalIndex = tempInternalIndex;
            console.log(this._internalIndex);
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
    fetchModel: function(query){
        if(query.name) {
            // if a specific name is specified, we just fetch one 
            if(this._internalIndex.hasOwnProperty(query.name)){
                var result = this._internalStore[this._internalIndex[query.name]];
                return {
                    configurations: [ result ]
                };
            } else {
                return null;
            }
        } else {
            if(query.sort){
                // make a local copy of the _internalStore, sort
                var local = this._internalStore.slice();
                local.sort(function(a, b){
                    if(a[query.sort] < b[query.sort]){
                        return -1;
                    }

                    if(a[query.sort]> b[query.sort]){
                        return 1;
                    }

                    return 0;
                });

                if(query.start){
                    // we also page here if we need to
                    local = getPaged(local, query.start, query.pageSize);
                }

                return {
                    configurations: local
                }
            } else if(query.start) {
                // page, check for "end" - if not there, use default
                var local = this._internalStore.slice();

                local = getPaged(local, query.start, query.pageSize);
                
                return {
                    configurations: local
                };
            } else {
                // just return the whole list... not filters/sorts specified
                return {
                    configurations: this._internalStore
                };
            }
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

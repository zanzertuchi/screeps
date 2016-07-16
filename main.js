var typeWorker = require('type.worker');

var workerGlobals = typeWorker;
//Create a global settings to handle 'stages' and 'Game Status(war/peace/pillage/etc);

module.exports.loop = function () {
    


    typeWorker.activateWorkers();
}

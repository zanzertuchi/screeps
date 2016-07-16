var typeWorker = require('type.worker');

var workerGlobals = typeWorker;
//Create a global settings to handle 'stages' and 'Game Status(war/peace/pillage/etc);

module.exports.loop = function () {
    
    //TODO ... MOVE TOWER heuehue
    
        var tower = Game.getObjectById('TOWER_ID');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }    

    typeWorker.activateWorkers();
}

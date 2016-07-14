var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports.loop = function () {
    

     for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    var workers = _.filter(Game.creeps, (creep) => creep.memory.type == 'worker');

    if(workers.length < 10) {
        var builders =  _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        var t_role = "";
        if(builders < 7 )
        t_role = 'builders';
        else
        t_role = 'upgrader';
        
        var newName = Game.spawns.P.createCreep([WORK,WORK,CARRY,CARRY, MOVE,MOVE], undefined, {role: t_role, type: 'worker'});
    }

    

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

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role =='scout')
        creep.moveTo(Game.flags.Flag1);
    }
}

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
		
        //Get them resources fool! 
        if(creep.carry.energy < creep.carryCapacity) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_SPAWN, structure.structureType == STRUCTURE_EXTENSION) && structure.energy < structure.energyCapacity;
                    }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
            else{
                var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
                 if(targets.length) {
                     if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0]);
                         }
                    }
                    else if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
								//If there's nothing to harvest become an upgrader! 
                            creep.memory.role = "upgrader";
                     }

            }
        }
    }
};

module.exports = roleHarvester;
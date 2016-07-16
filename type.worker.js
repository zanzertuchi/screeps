var helper = require('worker.helper');

var typeWorker = {

    spawn: function(creep) {

		var num_workers = _.filter(Game.creeps, (creep) => creep.memory.type == 'worker');
		//later these values should be deterimed by Room/Energy/building levels and shit - but I have no idea what that is yet :P 
		var ideal_workers = 10;
        //if we have less than total, lets spawn what we need TODO: need to setup dynamic boddies for works and check if CanSpawn)
        if (num_workers.length < ideal_workers  && creep.room.energyAvailable > 600){
            //this also means that we need to clean up memory.
             for(var name in Memory.creeps) {
                if(!Game.creeps[name]) {
                    delete Memory.creeps[name];
                }
             }
            //TODO: Use helper class and spawn based on sources.
            var useThisSource = helper.sourceWorkNum(creep);
            var useSpawn = creep.room.spawns;
            var newName = Game.spawns.Pcake1.createCreep([WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], 
                undefined, {currentJob: "harvester", type: 'worker', useSource: useThisSource, working: false});
            }    
    },

    work: function(){
        typeWorker.activateWorkers();
    },
    activateWorkers: function(){
        

        for(var name in Game.creeps){
            var creep = Game.creeps[name];
            //build a ROAD! 
            var spot = creep.pos.lookFor(LOOK_STRUCTURES);
            if(!spot.length){
                creep.pos.createConstructionSite(STRUCTURE_ROAD);
            }
            //check spawn
            typeWorker.spawn(creep);
            
            // working workers please! :D 
            if(creep.memory.working && creep.carry.energy == 0) {
                  creep.memory.working = false;
            }
            else if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
                creep.memory.working = true;
                typeWorker.assignJob(creep);
            }
            
            if(creep.memory.working){
                if(creep.memory.currentJob == "upgrader"){
                    if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller);
                    }
                }    
                else if(creep.memory.currentJob == "builder"){
                    var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
                    if(target){
                        if(creep.build(target) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(target);
                        }
                    }                
                }
                else if(creep.memory.currentJob == "harvester"){
                    var targets = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || 
                            structure.structureType == STRUCTURE_TOWER)  && structure.energy < structure.energyCapacity;
                        }
                    });
                    
                    var closestTarget = creep.pos.findClosestByPath(targets);
        
                    var containerTargets = creep.room.find(FIND_STRUCTURES, {
                            filter: (i) => i.structureType == STRUCTURE_CONTAINER && 
                                           _.sum(i.store) < i.storeCapacity
                        });
                    if (targets.length > 0) {
                        if (creep.transfer(closestTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(closestTarget);
                        }
                    }
                    else if (containerTargets.length > 0 ){
                        if (creep.transfer(containerTargets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(containerTargets[0]);
                        }
                    }                    
                    
                }
                else
                creep.say("Someone help me.. I'm lost! :( ");
            }
            
            else if(!creep.memory.working){
            //getting sources - check storage first if not harvester.
                if(creep.memory.currentJob != "harvester" &&
                    helper.findContainer(creep)){
                    var container = helper.findContainer(creep);
                    if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    	creep.moveTo(container);    
                    }
                  }
                else{
                      //harvester go straight to sources! :3
                    var target = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY);
                    if(target) {
                        if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(target);
                        }
                    }
                    else if(creep.harvest(Game.getObjectById(creep.memory.useSource)) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(Game.getObjectById(creep.memory.useSource));
                    }
                }
            }
        }
    },
    assignJob: function(creep){
        
        var workerStatus = helper.getWorkStatus(creep);
        if(workerStatus.needHarv){
           //we need you harvester Humant! You're our only hope! 
            creep.memory.currentJob = "harvester";
        }
        else if(workerStatus.needBuild){
            //Whatcha wanna build?
            creep.memory.currentJob = "builder";
        }
        else
            creep.memory.currentJob = "upgrader";
    }
       
       
};

module.exports = typeWorker;
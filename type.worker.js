var helper = require('worker.helper');

var typeWorker = {

    spawn: function(creep) {

		var num_workers = _.filter(Game.creeps, (creep) => creep.memory.type == 'worker');
		//later these values should be deterimed by Room/Energy/building levels and shit - but I have no idea what that is yet :P 
		var ideal_workers = 14;
        //if we have less than total, lets spawn what we need TODO: need to setup dynamic boddies for works and check if CanSpawn)
        if (num_workers.length < ideal_workers  && creep.room.energyAvailable > 299){
            //this also means that we need to clean up memory.
             for(var name in Memory.creeps) {
                if(!Game.creeps[name]) {
                    delete Memory.creeps[name];
                }
             }
            //TODO: Use helper class and spawn based on sources.
            var useThisSource = helper.sourceWorkNum(creep);
            var useSpawn = creep.room.spawns;
            var body = [WORK,CARRY,CARRY,MOVE,MOVE];
            if(creep.room.energyCapacityAvailable >= 400){
                var phase =100;
                var currentPhase = (creep.room.energyCapacity - 300) / phase;
                var isOdd = function(x) { return x & 1; };
                for(var i = 0; i< currentPhase; i++)
                {
                    if(!isOdd(i))
                    body.push(CARRY,MOVE)
                    else
                    body.push(WORK)
                }
            }
            var newName = Game.spawns.Pca.createCreep(body, 
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
                            
                    var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES, {
                             filter: (structure) => {
                            return (structure.structureType == STRUCTURE_EXTENSION)
                            }
                         });
                     if(!target)   
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
                    var droppedR = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY);
                    if(droppedR) {
                        if(creep.pickup(droppedR) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(droppedR);
                        }
                    }
                    else{ 
                        var u_source = Game.getObjectById(creep.memory.useSource);
                        if(u_source){
                            if(creep.harvest(u_source) == ERR_NOT_IN_RANGE )
                            creep.moveTo(Game.getObjectById(creep.memory.useSource));}
                        else
                        var sourc = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
                            if(creep.harvest(sourc) == ERR_NOT_IN_RANGE)
                            creep.moveTo(sourc);
                            
                        
                    }

                }
            }
        }
    },
    assignJob: function(creep){
                    
            ///test..


            //TEST // 
        
        
        var workerStatus = helper.getWorkStatus(creep);
        if(workerStatus.needUpgrs && workerStatus.workers > 1)
            creep.memory.currentJob = "upgrader";    
        else if(workerStatus.needHarv)
            creep.memory.currentJob = "harvester";
        else if(workerStatus.needBuild){
            //Whatcha wanna build?
            creep.memory.currentJob = "builder";
        }
        else
            creep.memory.currentJob = "upgrader";
    }
       
       
};

module.exports = typeWorker;
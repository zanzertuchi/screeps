/*
TODO -- looks like we could extend some prototypes? investigate! 
*/
 
 
var workerHelper = {
    //Would be nice to add a 'busy' function to find out how busy the source was and maybe use another.
    
    //I wanted to use Storage unites as a go to for 'builders/repairs'
    findContainer: function(creep){
            //return closed storage bin.
        var container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (i) => i.structureType == STRUCTURE_CONTAINER && 
                               i.store[RESOURCE_ENERGY] > 100
            });
            return container;
    },
    sourceWorkNum: function(creep){
        //I wanted to find out how many spots where accessible around a source, so I could calculate  better harvester spawn rates.
         var sources = creep.room.find(FIND_SOURCES);
         
         var available = [];
         var gAvailable = [];
         for (var i = 0; i < sources.length; i ++){
             //Get all positions around eash sources
             var getAvailable = 0;
             if(Game.map.getTerrainAt(sources[i].pos.x + 1, sources[i].pos.y, sources[i].room.name) != "wall")
                getAvailable ++;
             if(Game.map.getTerrainAt(sources[i].pos.x + 1, sources[i].pos.y -1, sources[i].room.name) != "wall")
                getAvailable ++;
             if(Game.map.getTerrainAt(sources[i].pos.x -1, sources[i].pos.y - 1, sources[i].room.name) != "wall")
                getAvailable ++;     
             if(Game.map.getTerrainAt(sources[i].pos.x -1, sources[i].pos.y, sources[i].room.name) != "wall")
                getAvailable ++;                     
             if(Game.map.getTerrainAt(sources[i].pos.x -1, sources[i].pos.y +1, sources[i].room.name) != "wall")
                getAvailable ++;
             if(Game.map.getTerrainAt(sources[i].pos.x +1, sources[i].pos.y +1, sources[i].room.name) != "wall")
                getAvailable ++;                
             if(Game.map.getTerrainAt(sources[i].pos.x, sources[i].pos.y -1, sources[i].room.name) != "wall")
                getAvailable ++;
             if(Game.map.getTerrainAt(sources[i].pos.x, sources[i].pos.y +1, sources[i].room.name) != "wall")
                getAvailable ++;                
             available.push(sources[i].id);
             gAvailable.push(getAvailable);
         }

         for(var i=0; i < available.length; i++){
            var source = _.filter(Game.creeps, (creep) => creep.memory.useThisSource == available[i]);
            if(source.length < gAvailable[i]){
             return useThisSource = available[i];
            }
         }
        return useThisSource;
    },
    getWorkStatus: function(creep) {
            var workerStats = workerHelper.getWorkerStatus(creep);
            var m_needHarv = workerStats.harvs <=4 && creep.room.energyAvailable < creep.room.energyCapacityAvailable;

            var sites = creep.room.find(FIND_CONSTRUCTION_SITES);
            var m_needBuild = sites.length > workerStats.builds && workerStats.builds <= workerStats.workers / 2;
            var m_needUps = workerStats.upgrs < 1;
            return {
                needHarv: m_needHarv,
                needBuild: m_needBuild,
                needUpgrs: m_needUps
            };
        },
    getWorkerStatus: function(creep){
            var num_harvs = _.filter(Game.creeps, (creep) => creep.memory.currentJob == 'harvester');
            var num_build = _.filter(Game.creeps, (creep) => creep.memory.currentJob == 'builder');
            var num_upgrs = _.filter(Game.creeps, (creep) => creep.memory.currentJob == 'upgrader');
            var num_workers = _.filter(Game.creeps, (creep) => creep.memory.type == 'worker');

            return{
                harvs: num_harvs.length,
                builds: num_build.length,
                upgrs: num_upgrs.length,
                workers: num_workers.length

            }
    }
};
    
    
    
    
module.exports = workerHelper;
/**
 * @file Builder role definition.
 * @summary Builders repair and construct structures.
 * @author Dom Light
 * @license MIT
 */

module.exports = require("role-base")({
	"name":        "builder",
	"definitions": [
		[ WORK, WORK, CARRY, MOVE ],
	],
	"action": buildAction,
});

const buildOrder = [
	STRUCTURE_RAMPART,
	STRUCTURE_WALL,
	STRUCTURE_EXTENSION,
	STRUCTURE_STORAGE,
	STRUCTURE_ROAD,
	STRUCTURE_LINK,
];

/**
 * Makes the specified creep behave as a builder.
 * @param {Creep} creep The creep that should behave as a builder.
 */
function buildAction (creep) {
	if (!creep.carry.energy) {
		// Return to spawn to get energy.
		creep.moveToSpawn(1);
		const spawn = creep.getSpawn();
		spawn.transferEnergy(creep);
		return;
	}

	// If any structures are below 1000 hitpoints, repair them.
	let broken;
	if (creep.memory.targetRepair) {
		broken = Game.getObjectById(creep.memory.targetRepair);
	} else {
		broken = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
			"filter": x => x.hits < 1000,
		});
		if (broken) {
			creep.say("Repair");
			creep.memory.targetRepair = broken.id;
		}
	}

	if (broken) {
		creep.moveToRange(broken, 1);
		creep.repair(broken);
		if (broken.hits >= 3000 || broken.hits === broken.hitsMax) {
			delete creep.memory.targetRepair;
		}

		return;
	}

	// If there's anything to build, build it.
	let toBuild;
	if (creep.memory.targetBuild) {
		toBuild = Game.getObjectById(creep.memory.targetBuild);
	} else {
		toBuild = _.sortBy(creep.room.find(FIND_CONSTRUCTION_SITES),
			x => _.indexOf(buildOrder, x.structureType))[0];

		if (toBuild) {
			creep.say("Build");
			creep.memory.targetBuild = toBuild.id;
		}
	}

	if (toBuild) {
		creep.moveToRange(toBuild, 1);
		creep.build(toBuild);
		return;
	}

	delete creep.memory.targetBuild;

	// Otherwise, return to base.
	creep.moveToSpawn(2);
}

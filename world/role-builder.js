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
	"action":   buildAction,
	"retreats": false,
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
		delete creep.memory.target;
		creep.moveToSpawn(1);
		const spawn = creep.getSpawn();
		spawn.transferEnergy(creep);
		return;
	}

	if (creep.memory.target) {
		// Continue doing our previous job.
		const target = Game.getObjectById(creep.memory.target.id);
		const action = creep.memory.target.action;
		if (!target || (action === "repair" && (target.hits >= 10000 || target.hits === target.hitsMax))) {
			// We're done; find something else to do.
			delete creep.memory.target;
			buildAction(creep);
			return;
		}

		creep.moveToRange(target, 1);
		if (action === "repair") {
			creep.repair(target);
		} else {
			creep.build(target);
		}
		return;
	}

	// If any structures are below 5000 hitpoints, repair them.
	const broken = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
		"filter": x => x.hits < 5000 && x.hits !== x.hitsMax,
	});
	if (broken) {
		creep.say(`repair ${broken.structureType}`);
		creep.memory.target = { "id": broken.id, "action": "repair" };
		buildAction(creep);
		return;
	}

	// If there's anything to build, build it.
	const toBuild = _.sample(creep.room.find(FIND_CONSTRUCTION_SITES));
	if (toBuild) {
		creep.say(`build ${toBuild.structureType}`);
		creep.memory.target = { "id": toBuild.id, "action": "build" };
		buildAction(creep);
		return;
	}

	// Move to the room controller to upgrade it.
	creep.moveToRange(creep.room.controller, 1);
	creep.upgradeController(creep.room.controller);
}

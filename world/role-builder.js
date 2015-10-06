/**
 * @file Builder role definition.
 * @summary Builders repair and construct structures.
 * @author Dom Light
 * @license MIT
 */

module.exports = require("role-base")({
	"name":        "builder",
	"definitions": [
		[ WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE ],
		[ WORK, WORK, WORK, CARRY, CARRY, MOVE ],
		[ WORK, WORK, CARRY, MOVE ],
	],
	"action":   buildAction,
	"retreats": false,
});

/**
 * Makes the specified creep behave as a builder.
 * @param {Creep} creep The creep that should behave as a builder.
 */
function buildAction (creep) {
	if (!creep.carry.energy) {
		// Return to spawn to get energy.
		delete creep.memory.target;
		creep.moveToSpawn(1);
		if (creep.room.getStoredEnergy() >= 300) {
			creep.getSpawn().transferEnergy(creep);
		}
		return;
	}

	if (creep.memory.target) {
		// Continue doing our previous job.
		var target = Game.getObjectById(creep.memory.target.id);
		var action = creep.memory.target.action;
		if (!target || (action === "repair" && (target.hits === target.hitsMax))) {
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

	// If any structures are below half health, repair them.
	var broken = _.chain(creep.room.find(FIND_MY_STRUCTURES, {
		"filter": x => x.hits < 500000 && (x.hits / x.hitsMax) < 0.5,
	}))
		.sortBy(x => x.hits)
		.first()
		.value();

	if (broken) {
		creep.say(`repair ${broken.structureType}`);
		creep.memory.target = { "id": broken.id, "action": "repair" };
		buildAction(creep);
		return;
	}

	// If there's anything to build, build it.
	var toBuild = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
	if (toBuild) {
		creep.say(`build ${toBuild.structureType}`);
		creep.memory.target = { "id": toBuild.id, "action": "build" };
		buildAction(creep);
		return;
	}

	// Repair walls if there's nothing else to do.
	var wall = _.chain(creep.room.find(FIND_STRUCTURES, {
		"filter": x => x.structureType === STRUCTURE_WALL && x.hits < x.hitsMax,
	}))
		.sortBy(x => x.hits)
		.first()
		.value();

	if (wall) {
		creep.say("build wall");
		creep.memory.target = { "id": wall.id, "action": "repair" };
		buildAction(creep);
		return;
	}
}

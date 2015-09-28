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

	// If any structures are below 50% health, repair them.
	const broken = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
		"filter": x => x.hits / x.hitsMax < 0.5,
	});
	if (broken) {
		creep.moveToRange(broken, 1);
		creep.repair(broken);
	}

	// If there's anything to build, build it.
	const toBuild = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
	if (toBuild) {
		creep.moveToRange(toBuild, 1);
		creep.build(toBuild);
	}

	// Otherwise, return to base.
	creep.moveToSpawn(2);
}

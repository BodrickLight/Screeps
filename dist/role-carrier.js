/**
 * @file Carrier role definition.
 * @summary Carriers transport energy from the ground to a spawn.
 * @author Dom Light
 * @license MIT
 */

module.exports = require("role-base")({
	"name":        "carrier",
	"definitions": [
		[ CARRY, MOVE, CARRY, MOVE ],
		[ CARRY, MOVE ],
	],
	"action": carryAction,
});

/**
 * Makes the specified creep behave as a carrier.
 * @param {Creep} creep The creep that should behave as a carrier.
 */
function carryAction (creep) {
	if (!creep.memory.target) {
		// Find some energy on the ground to carry.
		const targets = creep.room.find(FIND_DROPPED_ENERGY, {
			"filter": s => true,
		});

		const target = targets[0];
		if (!target) {
			// No available energy to carry.
			return;
		}

		creep.memory.target = { "id": target.id };
	}

	if (creep.carry.energy < creep.carryCapacity) {
		// Can still carry more energy, move to the target to pick it up.
		const target = Game.getObjectById(creep.memory.target.id);
		if (!target) {
			// The energy no longer exists. Try to find some more.
			delete creep.memory.target;
			carryAction(creep);
			return;
		}

		creep.moveToRange(target, 0);
		creep.pickup(target);
	} else {
		// Full on energy - return to base to drop it off.
		creep.moveToSpawn(1);
		creep.transferEnergy(creep.getSpawn());
	}
}

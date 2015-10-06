/**
 * @file Carrier role definition.
 * @summary Carriers transport energy from a miner to a spawn.
 * @author Dom Light
 * @license MIT
 */

module.exports = require("role-base")({
	"name":        "carrier",
	"definitions": [
		[ CARRY, MOVE, CARRY, MOVE, CARRY, MOVE],
		[ CARRY, MOVE, CARRY, MOVE ],
		[ CARRY, MOVE ],
	],
	"action":   carryAction,
	"retreats": true,
});

/**
 * Makes the specified creep behave as a carrier.
 * @param {Creep} creep The creep that should behave as a carrier.
 */
function carryAction (creep) {
	if (creep.carry.energy) {
		// We've got some energy - return to base to drop it off.
		var target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
			"filter": x => x.energyCapacity && x.energy < x.energyCapacity,
		});

		if (target) {
			creep.moveTo(target);
			creep.transferEnergy(target);
			return;
		}

		// Try to find some more energy while we're waiting to drop it off.
	}

	if (!creep.memory.target) {
		// Find the largest stack of dropped energy.
		var target = _.chain(creep.room.find(FIND_DROPPED_ENERGY))
			.sortBy(x => x.energy)
			.last()
			.value();

		if (!target) {
			// No available energy.
			return;
		}

		creep.memory.target = { "id": target.id };
	}

	// Move to the target to pick up the energy.
	var target = Game.getObjectById(creep.memory.target.id);
	if (!target) {
		// Our energy no longer exists. Try to find some more.
		delete creep.memory.target;
		carryAction(creep);
		return;
	}

	creep.moveToRange(target, 1);
	var energy = target.pos.lookFor("energy")[0];
	creep.pickup(energy);
}

/**
 * @file Carrier role definition.
 * @summary Carriers transport energy from a miner to a spawn.
 * @author Dom Light
 * @license MIT
 */

module.exports = require("role-base")({
	"name":        "carrier",
	"definitions": [
		[ CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE ],
		[ CARRY, MOVE, CARRY, MOVE, CARRY, MOVE ],
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
		delete creep.memory.target;
		// We've got some energy - return to a spawn or extension to drop it off.
		var target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
			"filter": x => x.energyCapacity && x.energy < x.energyCapacity,
		});

		if (!target) {
			// No available spawns or extensions, try to use a store.
			target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
				"filter": x => x.storeCapacity && x.store.energy < x.storeCapacity,
			});
		}

		if (target) {
			creep.moveTo(target);
			creep.transferEnergy(target);
			return;
		}

		// Try to find some more energy while we're waiting to drop it off.
	}

	if (!creep.memory.target) {
		// Find the closest dropped energy.
		var target = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY, {
			"filter": x => x.energy > 50,
		});

		if (!target) {
			// No dropped energy - check to see if any miners are carrying any.
			target = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
				"filter": x => x.getRole() === "miner" && x.carry.energy > 50,
			});
			if (!target) {
				// No available energy.
				return;
			}
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
	var miner = target.pos.lookFor("creep")[0];
	if (miner) {
		miner.transferEnergy(creep);
	}
}

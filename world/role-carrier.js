/**
 * @file Carrier role definition.
 * @summary Carriers transport energy from a miner to a spawn.
 * @author Dom Light
 * @license MIT
 */

module.exports = require("role-base")({
	"name":        "carrier",
	"definitions": [
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
	if (!creep.memory.target) {
		// Associate ourselves with a miner.
		var carriers = _.filter(Game.creeps, x => x.memory.role === "carrier"
			&& x.memory.target);

		var usedTargets = carriers.map(x => Game.getObjectById(x.memory.target.id));

		var target = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
			"filter": s => s.memory.role === "miner" && usedTargets.indexOf(s) === -1,
		});

		if (!target) {
			// No available miners.
			return;
		}

		creep.memory.target = { "id": target.id };
	}

	if (creep.carry.energy < creep.carryCapacity) {
		// Can still carry more energy, move to the target to pick it up.
		var target = Game.getObjectById(creep.memory.target.id);
		if (!target) {
			// Our miner no longer exists. Try to find another.
			delete creep.memory.target;
			carryAction(creep);
			return;
		}

		creep.moveToRange(target, 1);
		var energy = target.pos.lookFor("energy")[0];
		creep.pickup(energy);
	} else {
		// Full on energy - return to base to drop it off.
		creep.moveToSpawn(1);
		creep.transferEnergy(creep.getSpawn());
	}
}

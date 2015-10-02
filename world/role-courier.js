/**
 * @file Courier role definition.
 * @summary Couriers transport energy from a spawn to a builder or upgrader.
 * @author Dom Light
 * @license MIT
 */

module.exports = require("role-base")({
	"name":        "courier",
	"definitions": [
		[ CARRY, MOVE, CARRY, MOVE ],
		[ CARRY, MOVE ],
	],
	"action":   courierAction,
	"retreats": true,
});

/**
 * Makes the specified creep behave as a courier.
 * @param {Creep} creep The creep that should behave as a courier.
 */
function courierAction (creep) {
	if (!creep.memory.target) {
		// Find an upgrader or builder who needs energy.
		var target = creep.room.find(FIND_MY_CREEPS, {
			"filter": x => (x.memory.role === "upgrader" || x.memory.role === "builder") && x.carry.energy < x.carryCapacity,
		})[0];

		if (!target) {
			// No available targets.
			return;
		}

		creep.memory.target = { "id": target.id };
	}

	if (creep.carry.energy) {
		var target = Game.getObjectById(creep.memory.target.id);
		if (!target || target.carry.energy === target.carryCapacity) {
			// Our target no longer exists. Try to find another one.
			delete creep.memory.target;
			courierAction(creep);
			return;
		}

		creep.moveToRange(target, 1);
		creep.transferEnergy(target);
	} else {
		// No energy - return to spawn to pick some up.
		creep.moveToSpawn(1);
		var spawn = creep.getSpawn();
		if (spawn.energy >= 300) {
			spawn.transferEnergy(creep);
		}
	}
}

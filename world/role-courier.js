/**
 * @file Courier role definition.
 * @summary Couriers transport energy from a spawn to a builder or upgrader.
 * @author Dom Light
 * @license MIT
 */

module.exports = require("role-base")({
	"name":        "courier",
	"definitions": [
		[ CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE ],
		[ CARRY, MOVE, CARRY, MOVE, CARRY, MOVE ],
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
		var target = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
			"filter": x => (x.getRole() === "upgrader" || x.getRole() === "builder") && (x.carry.energy / x.carryCapacity) < 0.9,
		});

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
		// No energy - return to a store to pick some up.
		var store = creep.getEnergyStore();
		creep.moveTo(store);
		if (creep.room.energyAvailable >= 300) {
			store.transferEnergy(creep);
		}
	}
}

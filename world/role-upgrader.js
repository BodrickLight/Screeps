/**
 * @file Upgrader role definition.
 * @summary Upgraders upgrade the room's controller.
 * @author Dom Light
 * @license MIT
 */

module.exports = require("role-base")({
	"name":        "upgrader",
	"definitions": [
		[ WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE ],
		[ WORK, WORK, CARRY, MOVE ],
	],
	"action":   upgradeAction,
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
 * Makes the specified creep behave as an upgrader.
 * @param {Creep} creep The creep that should behave as an upgrader.
 */
function upgradeAction (creep) {
	if (!creep.carry.energy) {
		// Return to a store to get energy.
		delete creep.memory.target;
		var store = creep.getEnergyStore();
		creep.moveTo(store);
		if (creep.room.energyAvailable >= 300) {
			store.transferEnergy(creep);
		}
		return;
	}

	creep.moveToRange(creep.room.controller, 1);
	creep.upgradeController(creep.room.controller);
}

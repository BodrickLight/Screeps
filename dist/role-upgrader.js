/**
 * @file Upgrader role definition.
 * @summary Upgraders use energy from spawns to upgrade the room controller.
 * @author Dom Light
 * @license MIT
 */

module.exports = require("role-base")({
	"name":        "upgrader",
	"definitions": [
		[ MOVE, CARRY, WORK ],
	],
	"action": upgradeAction,
});

/**
 * Makes the specified creep behave as an upgrader.
 * @param {Creep} creep The creep that should behave as an upgrader.
 */
function upgradeAction (creep) {
	if (!creep.carry.energy) {
		// Return to spawn to get energy.
		creep.moveToSpawn(1);
		const spawn = creep.getSpawn();
		spawn.transferEnergy(creep);
	} else {
		// Move to the room controller to upgrade it.
		creep.moveToRange(creep.room.controller, 1);
		creep.upgradeController(creep.room.controller);
	}
}

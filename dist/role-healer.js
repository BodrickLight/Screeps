/**
 * @file Carrier role definition.
 * @summary Healers will heal any wounded creeps, then stay near a leader until
 * they are needed.
 * @author Dom Light
 * @license MIT
 */

module.exports = require("role-base")({
	"name":        "healer",
	"definitions": [
		[ MOVE, HEAL ],
	],
	"action": healAction,
});

/**
 * Makes the specified creep behave as a healer.
 * @param {Creep} creep The creep that should behave as a healer.
 */
function healAction (creep) {
	const target = creep.room.find(FIND_MY_CREEPS, {
		"filter": x => x.hits < x.hitsMax,
	})[0];

	if (target) {
		creep.moveTo(target);
		creep.heal(target);
	} else {
		// Return to the nearest leader.
		const leader = creep.room.find(FIND_MY_CREEPS, {
			"filter": x => x.memory.role === "leader",
		})[0];

		if (leader) {
			creep.moveToRange(leader, 1);
		} else {
			// No available leaders, return to spawn.
			creep.moveToSpawn(2);
		}
	}
}

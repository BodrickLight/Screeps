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
	"action":   healAction,
	"retreats": false,
});

/**
 * Makes the specified creep behave as a healer.
 * @param {Creep} creep The creep that should behave as a healer.
 */
function healAction (creep) {
	if (creep.hits < creep.hitsMax) {
		// Heal itself first.
		creep.heal(creep);
		return;
	}

	const target = creep.room.find(FIND_MY_CREEPS, {
		"filter": x => x.hits < x.hitsMax,
	})[0];

	if (target) {
		creep.moveTo(target);
		if (creep.pos.isNearTo(target)) {
			creep.heal(target);
		} else {
			creep.rangedHeal(target);
		}

		return;
	}

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

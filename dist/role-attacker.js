/**
 * @file Attacker role definition.
 * @summary Attackers try to stay close to a leader when there are no enemies
 * in sight, but will attack enemies if there are any nearby.
 * @author Dom Light
 * @license MIT
 */

module.exports = require("role-base")({
	"name":        "attacker",
	"definitions": [
		[ TOUGH, MOVE, ATTACK ],
	],
	"action": attackAction,
});

/**
 * Makes the specified creep behave as an attacker.
 * @param {Creep} creep The creep that should behave as an attacker.
 */
function attackAction (creep) {
	const target = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 4, {
		"filter": x => x.owner.username !== "Source Keeper",
	})[0];

	if (target) {
		// Attack the nearest target.
		creep.moveToRange(target, 1);
		creep.attack(target);
	} else {
		// Return to nearest leader.
		const leader = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
			"filter": x => x.memory.role === "leader",
		});

		if (leader) {
			creep.moveToRange(leader, 1);
		} else {
			// No leader: return to base.
			creep.moveToSpawn(2);
		}
	}
}

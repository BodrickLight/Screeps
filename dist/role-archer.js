/**
 * @file Archer role definition.
 * @summary Archers stay close to a leader, and attack any nearby enemies at
 * range.
 * @author Dom Light
 * @license MIT
 */

module.exports = require("role-base")({
	"name":        "archer",
	"definitions": [
		[ MOVE, RANGED_ATTACK ],
	],
	"action": archAction,
});

/**
 * Makes the specified creep behave as an archer.
 * @param {Creep} creep The creep that should behave as an archer.
 */
function archAction (creep) {
	const target = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3, {
		"filter": x => x.owner.username !== "Source Keeper",
	})[0];

	if (target) {
		// Attack the nearest target.
		creep.rangedAttack(target);
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

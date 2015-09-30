/**
 * @file Leader role definition.
 * @summary Leaders will simply seek out and attack all enemy creeps, then
 * return to their spawn once there are no more enemies.
 * @author Dom Light
 * @license MIT
 */

module.exports = require("role-base")({
	"name":        "leader",
	"definitions": [
		[ TOUGH, MOVE, ATTACK, ATTACK ],
	],
	"action":   leadAction,
	"retreats": false,
});

/**
 * Makes the specified creep behave as a leader.
 * @param {Creep} creep The creep that should behave as a leader.
 */
function leadAction (creep) {
	const target = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 10, {
		"filter": x => x.owner.username !== "Source Keeper",
	})[0];

	if (target) {
		// Attack the nearest target.
		creep.moveToRange(target, 1);
		creep.attack(target);
	} else {
		// Return to spawn.
		creep.moveToSpawn(2);
	}
}

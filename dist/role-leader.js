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
	"action": leadAction,
});

/**
 * Makes the specified creep behave as a leader.
 * @param {Creep} creep The creep that should behave as a leader.
 */
function leadAction (creep) {
	const target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS, {
		"filter": x => x.owner.username !== "Source Keeper",
	});

	if (target) {
		// Attack the nearest target.
		creep.moveToRange(target, 1);
		creep.attack(target);
	} else {
		// Return to spawn.
		creep.moveToSpawn(2);
	}
}

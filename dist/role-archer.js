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
	const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
		"filter": x => x.owner.username !== "Source Keeper",
	});

	if (target) {
		// Move to the closest rampart to the target.
		const rampart = target.pos.findClosestByRange(FIND_MY_STRUCTURES, {
			"filter": x => x.structureType === STRUCTURE_RAMPART
				&& (x.pos.isEqualTo(creep) || !x.pos.lookFor("creep").length)
				&& !x.progressTotal,
		});
		if (rampart) {
			creep.moveTo(rampart);
		} else if (creep.pos.inRangeTo(target.pos, 6)) {
			creep.moveToRange(target, 3);
		};

		if (creep.pos.inRangeTo(target.pos, 3)) {
			// Attack the nearest target.
			if (creep.pos.inRangeTo(target.pos, 1)) {
				creep.rangedMassAttack(target);
			} else {
				creep.rangedAttack(target);
			}
		}
	}
}

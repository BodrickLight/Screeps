/**
 * @file Archer role definition.
 * @summary Archers attack any nearby enemies at range.
 * @author Dom Light
 * @license MIT
 */

module.exports = require("role-base")({
	"name":        "archer",
	"definitions": [
		[ MOVE, RANGED_ATTACK, RANGED_ATTACK ],
		[ MOVE, RANGED_ATTACK ],
	],
	"action":   archAction,
	"retreats": false,
});

/**
 * Makes the specified creep behave as an archer.
 * @param {Creep} creep The creep that should behave as an archer.
 */
function archAction (creep) {
	var target = getTarget(creep);

	if (target) {
		// Move to a rampart near the target.
		if (creep.pos.lookFor("structure")[0] && creep.pos.inRangeTo(target, 3)) {
			// We're ok in this rampart for now.
		} else {
			// Find a closer rampart.
			var rampart = target.pos.findInRange(FIND_MY_STRUCTURES, 3, {
				"filter": x => x.structureType === STRUCTURE_RAMPART
					&& !x.pos.lookFor("creep").length
					&& !x.progressTotal,
			})[0];
			if (rampart) {
				creep.moveTo(rampart);
			} else if (creep.pos.inRangeTo(target.pos, 3)) {
				// No ramparts - just move close to the target.
				creep.moveToRange(target, 3);
			};
		}

		if (creep.pos.isNearTo(target.pos)) {
			// Do a mass attack to have a better chance of injuring other enemies.
			creep.rangedMassAttack(target);
			return;
		}

		if (creep.pos.inRangeTo(target.pos, 3)) {
			creep.rangedAttack(target);
		}

		return;
	}

	// No targets - go to a random rampart and wait.
}

/**
 * Returns the enemy this creep should attack.
 * @creep {Creep} The creep who should attack.
 * @returns {Creep} The creep that should be attacked, or null if no valid
 * creeps are available to attack.
 */
function getTarget (creep) {
	// Attack ranged creeps first...
	const ranged = getClosestWithBodypart(creep, RANGED_ATTACK);
	if (ranged) {
		return ranged;
	}

	// Then melee creeps...
	const melee = getClosestWithBodypart(creep, ATTACK);
	if (melee) {
		return melee;
	}

	// Attack healers first...
	const healer = getClosestWithBodypart(creep, HEAL);
	if (healer) {
		return healer;
	}

	// And if all else fails, fall back on just targetting the nearest enemy.
	const closest = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
		"filter": x => x.owner.username !== "Source Keeper",
	});

	return closest;
}

/**
 * Returns the closest enemy creep with the specified body part.
 * @param {Creep} creep The creep to which the closest enemy should be found.
 * @param {string} part The body part which should be found.
 * @returns {Creep} The closest matching enemy creep, or null if no
 * matching creep was found.
 */
function getClosestWithBodypart (creep, part) {
	const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
		"filter": x => x.getActiveBodyparts(part),
	});
	if (target && creep.pos.inRangeTo(target, 3)) {
		return target;
	}

	return null;
}

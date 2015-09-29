/**
 * @file Miner role definition.
 * @summary Miners move to a nearby source, then mine its energy and drop it
 * on the ground for a carrier to collect.
 * @author Dom Light
 * @license MIT
 */

module.exports = require("role-base")({
	"name":        "miner",
	"definitions": [
		[ WORK, WORK, MOVE ],
	],
	"action": mineAction,
});

/**
 * Makes the specified creep behave as a miner.
 * @param {Creep} creep The creep that should behave as a miner.
 */
function mineAction (creep) {
	if (!creep.memory.source) {
		// Find an available source.
		const target = creep.pos.findClosestByRange(FIND_SOURCES, {
			"filter": s => true,
		});

		creep.memory.source = { "id": target.id };
	}

	// Move to the source, and start mining it.
	const target = Game.getObjectById(creep.memory.source.id);
	creep.moveToRange(target, 1);
	creep.harvest(target);
}

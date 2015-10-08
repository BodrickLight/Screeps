/**
 * @file Miner role definition.
 * @summary Miners move to a suitable nearby source, then mine its energy and
 * drop it on the ground for a carrier to collect.
 * @author Dom Light
 * @license MIT
 */

module.exports = require("role-base")({
	"name":        "miner",
	"definitions": [
		[ WORK, WORK, MOVE ],
	],
	"action":   mineAction,
	"retreats": true,
});

/**
 * Makes the specified creep behave as a miner.
 * @param {Creep} creep The creep that should behave as a miner.
 */
function mineAction (creep) {
	if (!creep.memory.source) {
		// Find a suitable source.
		var miners = _.filter(Game.creeps, x => x.getRole() === "miner" && x.memory.source);
		var sources = miners.map(x => x.memory.source.id);

		var target = creep.room.find(FIND_SOURCES, {
			"filter": s => sources.filter(y => y === s.id).length < 2,
		})[0];

		creep.memory.source = { "id": target.id };
	}

	// Move to the source, and start mining it.
	var target = Game.getObjectById(creep.memory.source.id);
	creep.moveToRange(target, 1);
	creep.harvest(target);
}

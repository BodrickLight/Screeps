/**
 * @file Main entry point into the scripts.
 * @author Dom Light
 * @license MIT
 */

require("creepExt");
const roleFactory = require("roleFactory");
module.exports.loop = function () {
	// See if there's any new creeps that should be spawned.
	for (const spawn of _.values(Game.spawns)) {
		const nextRole = roleFactory.getNextRole(spawn.room);
		if (!nextRole) {
			continue;
		}

		const role = require("role-" + nextRole);
		const creepDefinition = role.getCreepDefinition(spawn);
		if (spawn.canCreateCreep(creepDefinition) === OK) {
			spawn.createCreep(creepDefinition, undefined, {
				"role":        role.name,
				"justSpawned": true,
				"spawn":       spawn.id,
			});
		}
	}

	// Make all the creeps do their actions.
	for (const creep of _.values(Game.creeps)) {
		if (creep.memory.role) {
			const role = require("role-" + creep.memory.role);
			role.action(creep);
		}
	}
};

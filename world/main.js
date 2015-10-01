/**
 * @file Main entry point into the scripts.
 * @author Dom Light
 * @license MIT
 */

require("creepExt");
const roleFactory = require("roleFactory");

module.exports.loop = loop;

function loop () {
	var t1 = new Date().getTime();

	// See if there's any new creeps that should be spawned.
	for (var spawn of _.values(Game.spawns)) {
		var nextRole = roleFactory.getNextRole(spawn.room);
		if (!nextRole) {
			continue;
		}

		var role = require("role-" + nextRole);
		var creepDefinition = role.getCreepDefinition(spawn);
		if (spawn.canCreateCreep(creepDefinition) === OK) {
			spawn.createCreep(creepDefinition, undefined, {
				"role":        role.name,
				"justSpawned": true,
				"spawn":       spawn.id,
			});
		}
	}

	var t2 = new Date().getTime();

	// Make all the creeps do their actions.
	for (var creep of _.values(Game.creeps)) {
		if (creep.memory.role) {
			var role = require("role-" + creep.memory.role);
			role.action(creep);
		}
	}

	var t3 = new Date().getTime();

	console.log(`roleFactory: ${t2 - t1}ms,
		roles: ${t3 - t2}ms,
		total: ${t3 - t1}ms`);
}

/**
 * @file Main entry point into the scripts.
 * @author Dom Light
 * @license MIT
 */

require("creepExt");
var roleFactory = require("roleFactory");

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
			var idx = 0;
			var name = "";
			do {
				idx++;
				name = role.name + "-" + idx;
			} while (Game.creeps[name])

			spawn.createCreep(creepDefinition, name, {
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
		} else {
			creep.suicide();
		}
	}

	var t3 = new Date().getTime();

	console.log(`roleFactory: ${t2 - t1}ms,
		roles: ${t3 - t2}ms,
		total: ${t3 - t1}ms`);
}

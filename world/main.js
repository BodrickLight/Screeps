/**
 * @file Main entry point into the scripts.
 * @author Dom Light
 * @license MIT
 */

require("creepExt");
var roleFactory = require("roleFactory");
var constructionPlanner = require("constructionPlanner");

module.exports.loop = loop;

function loop () {
	var t1 = new Date().getTime();

	// Handle any new constructions.
	for (const roomId in Game.rooms) {
		constructionPlanner.handleConstruction(Game.rooms[roomId]);
	}

	var t2 = new Date().getTime();

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

	var t3 = new Date().getTime();

	// Make all the creeps do their actions.
	for (var creep of _.values(Game.creeps)) {
		if (creep.memory.role) {
			var role = require("role-" + creep.memory.role);
			role.action(creep);
		}
	}

	var t4 = new Date().getTime();

	console.log(`constructionPlanner: ${t2 - t1}ms,
		roleFactory: ${t3 - t2}ms,
		roles: ${t4 - t3}ms,
		total: ${t4 - t1}ms`);
}

/**
 * @file Main entry point into the scripts.
 * @author Dom Light
 * @license MIT
 */

const t1 = new Date().getTime();
require("creepExt");
const roleFactory = require("roleFactory");
const constructionPlanner = require("constructionPlanner");

// Handle any new constructions.
for (const roomId in Game.rooms) {
	constructionPlanner.handleConstruction(Game.rooms[roomId]);
}

const t2 = new Date().getTime();

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

const t3 = new Date().getTime();

// Make all the creeps do their actions.
for (const creep of _.values(Game.creeps)) {
	if (creep.memory.role) {
		const role = require("role-" + creep.memory.role);
		role.action(creep);
	}
}

const t4 = new Date().getTime();

console.log(`constructionPlanner: ${t2 - t1}ms,
	roleFactory: ${t3 - t2}ms,
	roles: ${t4 - t3}ms,
	total: ${t4 - t1}ms`);

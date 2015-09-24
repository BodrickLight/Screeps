require("creepExt");
var roleFactory = require("roleFactory");

for (const spawn of _.values(Game.spawns)) {
	const nextRole = roleFactory.getNextRole(spawn.room);
	if (!nextRole)
		continue;

	const role = require("role-" + nextRole);
	var creepDefinition = role.getCreepDefinition(spawn);
	if (spawn.canCreateCreep(creepDefinition) === OK)
		spawn.createCreep(creepDefinition, undefined, { "role": role.name, "justSpawned": true, "spawn": spawn.id });
}

for (const creep of _.values(Game.creeps)) {
	if (creep.memory.role) {
		const role = require("role-" + creep.memory.role);
		role.action(creep);
	}
}

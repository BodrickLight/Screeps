const _ = require("lodash");
function nextRole (room) {
	const order = [
		{role: "miner", count: 1},
		{role: "carrier", count: 1},
		{role: "miner", count: 3},
		{role: "carrier", count: 3},
	];

	const creeps = Game.creeps.filter(x => x.room.id === room.id);
	const types = _.groupBy(creeps, x => x.memory.role);

	for (const item of order)
		if (!types[item.role] || types[item.role].length < item.count)
			return item.role;

	return null;
}

for (const i in Game.spawns) {
	const spawn = Game.spawns[i];
	const nextRole = nextRole(spawn.room);
	if (!nextRole)
		continue;

	const role = require("role-" + nextRole);
	var creepDefinition = role.getCreepDefinition(spawn);
	if (spawn.canSpawnCreep(creepDefinition) === 0)
		spawn.spawnCreep(creepDefinition, undefined, { role: role.name });
}

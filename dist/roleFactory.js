module.exports = {
	"getNextRole": getNextRole
};

function getNextRole (room) {
	const order = [
		{"role": "miner",    "count": 1},
		{"role": "carrier",  "count": 1},
		{"role": "leader",   "count": 1},
		{"role": "healer",   "count": 1},
		{"role": "attacker", "count": 2},
		{"role": "miner",    "count": 2},
		{"role": "carrier",  "count": 2},
		/*{"role": "miner",   "count": 3},
		{"role": "carrier", "count": 3},*/
	];

	const creeps = _.values(Game.creeps).filter(x => x.room.id === room.id);
	const types = _.groupBy(creeps, x => x.memory.role);

	for (const item of order)
		if (!types[item.role] || types[item.role].length < item.count)
			return item.role;

	return null;
}
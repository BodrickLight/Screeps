/**
 * @file Calculates which role should be spawned in a given room.
 * @author Dom Light
 * @license MIT
 */

module.exports = {
	"getNextRole": getNextRole,
};

/**
 * Returns the next role that should be spawned in the specified room.
 * @param {Room} room The room in which the creep should be spawned.
 * @returns {string} The role that should be spawned next, or null if no new
 * role should be spawned.
 */
function getNextRole (room) {
	// Define the order in which creeps should spawn. Once 'count' number of
	// creeps of type 'role' exist in the room, move onto the next item in the
	// array.
	const order = [
		{ "role": "miner",    "count": 1 },
		{ "role": "carrier",  "count": 1 },
		{ "role": "leader",   "count": 1 },
		{ "role": "healer",   "count": 1 },
		{ "role": "attacker", "count": 2 },
		{ "role": "miner",    "count": 2 },
		{ "role": "carrier",  "count": 2 },
		/* { "role": "miner",   "count": 3 },
		{ "role": "carrier", "count": 3 },*/
	];

	const creeps = _.values(Game.creeps).filter(x => x.room.id === room.id);
	const types = _.groupBy(creeps, x => x.memory.role);

	for (const item of order) {
		if (!types[item.role] || types[item.role].length < item.count) {
			return item.role;
		}
	}

	return null;
}

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
	if (!room) {
		return;
	}

	var order = [
		{ "role": "miner",    "count": 1 },
		{ "role": "carrier",  "count": 2 },
		{ "role": "miner",    "count": 2 },
		{ "role": "carrier",  "count": 4 },

		{ "role": "builder",  "count": 4 },
	];

	var creeps = _.values(Game.creeps).filter(x => x && x.room && x.room.name === room.name);
	var types = _.groupBy(creeps, x => x && x.memory && x.memory.role);
	for (var item of order) {
		if (!types[item.role] || types[item.role].length < item.count) {
			return item.role;
		}
	}

	return null;
}

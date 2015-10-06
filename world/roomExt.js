/**
 * @file Additions to Room.prototype.
 * @author Dom Light
 * @license MIT
 */


_.assign(Room.prototype, {
	"getStoredEnergy": getStoredEnergy,
});

/**
 * Gets the amount of energy stored in structures in this room.
 * @returns {number} The amount of energy stored in this room.
 */
function getStoredEnergy () {
	var buildings = this.find(FIND_MY_STRUCTURES);
	return _.sum(buildings, x => x.energy);
}

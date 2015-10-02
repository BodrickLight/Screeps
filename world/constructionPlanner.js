/**
 * @file Calculates where new buildings should be placed.
 * @author Dom Light
 * @license MIT
 */

module.exports = {
	"handleConstruction": handleConstruction,
};

/**
 * Handles the placement of construction sites in a given room.
 * @param {Room} room The room in which construction should be managed.
 */
function handleConstruction (room) {
	if (room.controller.level >= 3) {
		placeRoads(room);
	}
}

/**
 * Places a road under a civilian creep that is fatigued.
 * @param {Room} room The room in which the road should be placed.
 */
function placeRoads (room) {
	if (room.find(FIND_CONSTRUCTION_SITES, {
		"filter": x => x.structureType === STRUCTURE_ROAD,
	}).length > 2) {
		// Only construct 2 roads at a time.
		return;
	}

	var creep = room.find(FIND_MY_CREEPS, {
		"filter": x => x.fatigue > 0,
	})[0];
	if (creep) {
		room.createConstructionSite(creep.pos, STRUCTURE_ROAD);
	}
}

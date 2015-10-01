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
	if (!Game.time % 10) {
		// Throttle, as this can be expensive.
		return;
	}

	if (room.controller.level >= 2) {
		placeRamparts(room);
		// placeExtensions(room);
	}

	if (room.controller.level >= 3) {
		placeRoads(room);
	}
}

/**
 * Places ramparts in the given room.
 * @param {Room} room The room in which ramparts should be placed.
 */
function placeRamparts (room) {
	var exits = room.find(FIND_EXIT);
	for (var exit of exits) {
		constructAroundRange(room, room.getPositionAt(exit.x, exit.y), 2, STRUCTURE_RAMPART);
	}
}

/**
 * Places extensions in the given room.
 * @param {Room} room The room in which the extensions should be placed.
 */
function placeExtensions (room) {
	var spawns = room.find(FIND_MY_SPAWNS);
	for (var spawn of spawns) {
		constructAroundRange(room, spawn.pos, 2, STRUCTURE_EXTENSION);
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

/**
 * Places the given construction type around the target position at a given
 * range.
 * @param {Room} room The room in which the construction should be placed.
 * @param {RoomPosition} center The position around which the constructions
 * should be placed.
 * @param {number} range The range at which constructions should be placed.
 * @param {string} type The type of construction to be placed.
 */
function constructAroundRange (room, center, range, type) {
	for (var x = center.x - range; x <= center.x + range; x++) {
		for (var y = center.y - range; y <= center.y + range; y++) {
			if (Math.abs(center.x - x) === range
				|| Math.abs(center.y - y) === range) {
				room.createConstructionSite(x, y, type);
			}
		}
	}
}

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
	if (room.controller.level >= 2 && !(Game.time % 10)) {
		placeRamparts(room);
		// placeExtensions(room);
	}
}

/**
 * Places ramparts in the given room.
 * @param {Room} room The room in which ramparts should be placed.
 */
function placeRamparts (room) {
	const spawns = room.find(FIND_MY_SPAWNS);
	for (const spawn of spawns) {
		constructAroundRange(room, spawn.pos, 5, STRUCTURE_RAMPART);
		// constructAroundRange(room, spawn.pos, 6, STRUCTURE_RAMPART);
	}
}

/**
 * Places extensions in the given room.
 * @param {Room} room The room in which the extensions should be placed.
 */
function placeExtensions (room) {
	const spawns = room.find(FIND_MY_SPAWNS);
	for (const spawn of spawns) {
		constructAroundRange(room, spawn.pos, 2, STRUCTURE_EXTENSION);
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
	for (let x = center.x - range; x <= center.x + range; x++) {
		for (let y = center.y - range; y <= center.y + range; y++) {
			if (Math.abs(center.x - x) === range
				|| Math.abs(center.y - y) === range) {
				room.createConstructionSite(x, y, type);
			}
		}
	}
}

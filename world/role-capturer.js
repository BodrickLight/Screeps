/**
 * @file Capturer role definition.
 * @summary Capturers try to capture empty room controllers.
 * @author Dom Light
 * @license MIT
 */

module.exports = require("role-base")({
	"name":        "capturer",
	"definitions": [
		[ MOVE, CARRY, WORK, MOVE, CARRY, WORK ],
	],
	"action":   captureAction,
	"retreats": true,
});

/**
 * Makes the specified creep behave as a capturer.
 * @param {Creep} creep The creep that should behave as a capturer.
 */
function captureAction (creep) {
	if (creep.room.id !== creep.memory.roomId) {
		// We've just changed rooms. Recalculate what we should be doing.
		delete creep.memory.target;
	}

	if (!creep.memory.target) {
		creep.memory.roomId = creep.room.id;

		var controller = creep.room.controller;
		if (controller) {
			creep.memory.target = controller.id;
		} else {
			// No available controllers. Pick an available exit from the room
			// and go through it.
			creep.memory.target = _.sample(creep.room.find(FIND_EXIT)).id;
		}
	}

	var target = Game.getObjectById(creep.memory.target);
	creep.moveTo(target);
}

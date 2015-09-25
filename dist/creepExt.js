/**
 * @file Additions to Creep.prototype.
 * @author Dom Light
 * @license MIT
 */

_.assign(Creep.prototype, {
	"moveToSpawn": moveToSpawn,
	"moveToRange": moveToRange,
	"getSpawn":    getSpawn,
});

/**
 * Move this creep towards the spawn point from which it was spawned, stopping
 * once it is within the specified range.
 * @param {number} range The range at which the spawn is close enough.
 */
function moveToSpawn (range) {
	const spawn = this.getSpawn();
	if (!spawn) {
		return;
	}

	this.moveToRange(spawn, range);
}

/**
 * Move this creep towards the specified target, stopping once it is within the
 * specified range.
 * @param {object} target The target to move towards. Can be a {RoomPosition}
 * object or any object containing a {RoomPosition}.
 * @param {number} range The range at which the target is close enough.
 */
function moveToRange (target, range) {
	if (!target) {
		return;
	}

	if (!this.pos.inRangeTo(target, range)) {
		this.moveTo(target);
	}
}

/**
 * Get the spawn point from which this creep was spawned.
 * @returns {Spawn} The spawn point from which this creep was spawned.
 */
function getSpawn () {
	return Game.getObjectById(this.memory.spawn);
}

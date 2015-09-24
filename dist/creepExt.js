_.assign(Creep.prototype, {
	"moveToSpawn": moveToSpawn,
	"moveToRange": moveToRange,
	"getSpawn":    getSpawn,
});

function moveToSpawn(range) {
	const spawn = this.getSpawn();
	if (!spawn)
		return;

	this.moveToRange(spawn, range);
}

function moveToRange(target, range) {
	if (!target)
		return;

	if (!this.pos.inRangeTo(target, range))
		this.moveTo(target);
}

function getSpawn() {
	return Game.getObjectById(this.memory.spawn);
}
module.exports = require("role-base")({
	"name":        "miner",
	"definitions": [
		[WORK, WORK, MOVE],
	],
	"action": mineAction
});

function mineAction (creep) {
	if (!creep.memory.source) {
		const targets = creep.room.find(FIND_SOURCES, {
			"filter": s => true,
		});

		creep.memory.source = { "id": targets[0].id };
	}

	const target = Game.getObjectById(creep.memory.source.id);
	creep.moveToRange(target, 1);
	creep.harvest(target);
}
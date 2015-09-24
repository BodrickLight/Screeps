module.exports = require("role-base")({
	"name":        "carrier",
	"definitions": [
		[CARRY, MOVE, CARRY, MOVE],
		[CARRY, MOVE],
	],
	"action": carryAction
});

function carryAction (creep) {
	if (!creep.memory.target) {
		const targets = creep.room.find(FIND_DROPPED_ENERGY, {
			"filter": s => true,
		});

		const target = targets[0];
		if (!target)
			return;

		creep.memory.target = { "id": target.id };
	}

	if (creep.carry.energy < creep.carryCapacity) {
		const target = Game.getObjectById(creep.memory.target.id);
		if (!target) {
			delete creep.memory.target;

			// Try again.
			carryAction(creep);
			return;
		}

		creep.moveToRange(target, 0);
		creep.pickup(target);
	} else {
		creep.moveToSpawn(1);
		creep.transferEnergy(creep.getSpawn());
	}
}
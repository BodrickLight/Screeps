module.exports = require("role-base")({
	"name":        "healer",
	"definitions": [
		[MOVE, HEAL],
	],
	"action": healAction
});

function healAction (creep) {
	var target = creep.room.find(FIND_MY_CREEPS, {
		"filter": x => x.hits < x.hitsMax,
	})[0];

	if (target) {
		creep.moveTo(target);
		creep.heal(target);
	} else {
		// Return to the nearest leader.
		var leader = creep.room.find(FIND_MY_CREEPS, {
			"filter": x => x.memory.role === "leader",
		})[0];

		if (leader)
			creep.moveToRange(leader, 1);
		else
			creep.moveToSpawn(2);
	}
}
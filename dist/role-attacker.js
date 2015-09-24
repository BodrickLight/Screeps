module.exports = require("role-base")({
	"name":        "attacker",
	"definitions": [
		[TOUGH, MOVE, ATTACK],
	],
	"action": attackAction
});

function attackAction (creep) {
	var target = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 4, {
		"filter": x => x.owner.username !== "Source Keeper",
	})[0];

	if (target) {
		creep.moveToRange(target, 1);
		creep.attack(target);
	} else {
		// Return to nearest leader.
		var leader = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
			"filter": x => x.memory.role === "leader",
		});

		if (leader)
			creep.moveToRange(leader, 1);
		else
			// No leader: return to base.
			creep.moveToSpawn(2);
	}
}
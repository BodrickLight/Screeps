module.exports = require("role-base")({
	"name":        "leader",
	"definitions": [
		[TOUGH, MOVE, ATTACK, ATTACK],
	],
	"action": leadAction
});

function leadAction (creep) {
	var target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS, {
		"filter": x => x.owner.username !== "Source Keeper",
	});

	if (target) {
		creep.moveToRange(target, 1);
		creep.attack(target);
	} else {
		// Return to base.
		creep.moveToSpawn(2);
	}
}
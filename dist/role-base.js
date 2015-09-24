module.exports = function(cfg) {
	_.assign(cfg, {
		"name":        cfg.name || "undefined",
		"definitions": cfg.definitions || [],
		"action":      cfg.action || _.noop,
	});

	return {
		"name":               cfg.name,
		"getCreepDefinition": getCreepDefinition,
		"action":             action,
	};

	function getCreepDefinition(spawn) {
		for(var def of cfg.definitions)
			if (spawn.canCreateCreep(def) === OK)
				return def;

		return null;
	}

	function action(creep) {
		if (!creep.spawning && creep.memory && creep.memory.justSpawned) {
			creep.say(creep.memory.role);
			creep.memory.justSpawned = false;
		}

		cfg.action(creep);
	}
}

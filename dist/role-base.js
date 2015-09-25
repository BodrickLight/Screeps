/**
 * @file Base module that all other roles should inherit from.
 * @author Dom Light
 * @license MIT
 */

module.exports = function (cfg) {
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

	/**
	 * Returns the definition of a creep that should be spawned from the
	 * specified spawn point.
	 * @param {Spawn} spawn The spawn from which the creep should be spawned.
	 * @returns {object} An array containing the body parts of the creep to
	 * be spawned, or null if no valid definition is available.
	 */
	function getCreepDefinition (spawn) {
		for (const def of cfg.definitions) {
			if (spawn.canCreateCreep(def) === OK) {
				return def;
			}
		}

		return null;
	}

	/**
	 * Makes a creep perform the next action specified by its role.
	 * @param {Creep} creep The creep that is performing the action.
	 */
	function action (creep) {
		// If a creep has just spawned, make it say its role.
		if (!creep.spawning && creep.memory && creep.memory.justSpawned) {
			creep.say(creep.memory.role);
			creep.memory.justSpawned = false;
		}

		cfg.action(creep);
	}
};

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
		"retreats":    cfg.retreats || false,
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
		for (var def of cfg.definitions) {
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
		var t1 = new Date().getTime();

		if (cfg.retreats) {
			// This is a 'civilian' creep - if there's any enemies nearby, just return
			// to spawn.
			if (creep.pos.findInRange(FIND_HOSTILE_CREEPS, 4, {
				"filter": x => x.getActiveBodyparts(ATTACK) || x.getActiveBodyparts(RANGED_ATTACK),
			}).length) {
				creep.moveToSpawn(2);
				return;
			}
		}

		cfg.action(creep);
		var t2 = new Date().getTime();
		if ((t2 - t1) > 3) {
			console.log(`${creep.name}: ${t2 - t1}ms`);
		}
	}
};

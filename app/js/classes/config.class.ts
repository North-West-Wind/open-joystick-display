import clone from "clone";
import store from "store";
import { ojd } from "..";
import { DataConfig, DataConfigBounds } from "./data.d";

import configJson from "../data/config.json";
import profileJson from "../data/profile.json";
import mappingsJson from "../data/mappings.json";
import mappingsV2Json from "../data/mappings-v2.json";
import mappingsV3Json from "../data/mappings-v3.json";
import mappingsV4Json from "../data/mappings-v4.json";

/**
	Class Config
	System wide config handler for objects.
*/
export default class Config {
	config: Partial<DataConfig & { themeUserDirectory: string }>;
	currentMapping: object;
	/**
	 * constructor(cwd)
	 * Config class constructor.
	 */
	constructor() {
		// Class Variables
		this.config = {};
		this.currentMapping = {};

		// Make new config if one doesn't exist.
		this.init();

		// If config version 0, migrate.
		this.migrateConfigZero();

		// If config version 1, migrate.
		this.migrateConfigOne();

		// If config version 2, migrate.
		this.migrateConfigTwo();

		// If config version 3, migrate.
		this.migrateConfigThree();
	}

	/**
	 * Makes a new configuration if this is the first time it's being used.
	 * @param reset Overloaded method for reseting regardless of current state.
	 * @return success
	 */
	init(reset = false) {

		if (typeof store.get('config') !== "undefined") {
			if (!reset) {
				this.config = store.get('config');
				return false;
			}
		}

		const config = clone(configJson);
		const profile = clone(profileJson);
		const mappings = clone(mappingsJson);

		// Electron doesn't exist here
		/*
		// Center on Screen
		const screenSize = electron.screen.getPrimaryDisplay().size;
		config.bounds.x = parseInt((screenSize.width - config.bounds.width)/2, 10);
		config.bounds.y = parseInt((screenSize.height - config.bounds.height)/2, 10);
		*/

		store.set('mappings', mappings);
		store.set('profiles', [profile]);
		store.set('config', config);

		this.config = store.get('config');

		return true;
	}

	migrateConfigThree() {

		if (this.config.version !== 3) {
			return false;
		}
		console.log("migrate 3");

		const newMappings = clone(mappingsV4Json);
		const mappings = store.get('mappings');
		for (const map of newMappings) {
			mappings.push(map);
		}
		for (const map of mappings) {
			map.triggerFixed = [];
		}
		store.set('mappings', mappings);

		// Set Config to Version 4
		this.config.version = 4;
		store.set('config', this.config);

		// Reload
		this.config = store.get('config');

	}

	migrateConfigTwo() {

		if (this.config.version !== 2) {
			return false;
		}
		console.log("migrate 2");

		const newMappings = clone(mappingsV3Json);
		const mappings = store.get('mappings');
		for (const map of newMappings) {
			mappings.push(map);
		}
		for (const map of mappings) {
			map.triggerFixed = [];
		}
		store.set('mappings', mappings);

		// Set Config to Version 2
		this.config.version = 3;
		store.set('config', this.config);

		// Reload
		this.config = store.get('config');

	}

	/*
	 * migrateConfigOne()
	 * @return bool
	 * Migrates config version 1 to version 2. Adds new default mappings for RetroSpy.
	 */
	migrateConfigOne() {

		if (this.config.version !== 1) {
			return false;
		}
		console.log("migrate 1");

		// Push new mappings for this release.
		const newMappings = clone(mappingsV2Json);
		const mappings = store.get('mappings');
		for (const map of newMappings) {
			mappings.push(map);
		}
		store.set('mappings', mappings);

		// Set Config to Version 2
		this.config.version = 2;
		store.set('config', this.config);

		// Reload
		this.config = store.get('config');

	}

	/*
	 * migrateConfigZero()
	 * @return bool
	 * Migrates config version 0 to version 1. Separates mappings and profile from core config for easy backups.
	 */
	migrateConfigZero() {

		if (this.config.version !== 0) {
			return false;
		}
		console.log("migrate 0");

		// Migrate to new profile system, will be removed in future releases.
		const profile = clone(profileJson);
		const mappings = clone(this.config.mappings);

		profile.theme 			= this.config.theme;
		profile.map 			= this.config.map;
		profile.chroma 			= this.config.chroma;
		profile.chromaColor 	= this.config.chromaColor;
		profile.alwaysOnTop 	= this.config.alwaysOnTop;
		profile.zoom 			= this.config.zoom*100;

		// Remove, no longer in config store.
		delete this.config.theme;
		delete this.config.map;
		delete this.config.chroma;
		delete this.config.chromaColor;
		delete this.config.alwaysOnTop;
		delete this.config.zoom;
		delete this.config.mappings;

		this.config.profile = 0;

		this.config.version = 1;
		store.set('mappings', mappings);
		store.set('profiles', [profile]);
		store.set('config', this.config);

		// Reload
		this.config = store.get('config');

		return true;

	}

	/**
	 * Sets the current bounds of the window in non-broadcast mode. {x:, y:, height:, width:}.
	 * @param bounds bounds
	 * @return object
	 */
	setBounds(bounds: DataConfigBounds) {
		this.config.bounds = clone(bounds);
		this.save();
		return bounds;
	}

	/*
	 * getBounds()
	 * @return object
	 * Returns the current bounds of the window when in interface mode. {x:, y:, height:, width:}. Typically used during launch.
	 */
	getBounds() {
		return this.config.bounds;
	}

	/*
	 * toggleBroadcast()
	 * @return bool
	 * Toggles between interface and broadcast mode.
	 */
	toggleBroadcast() {
		this.config.broadcast = !this.config.broadcast;
		this.save();
		return this.config.broadcast;
	}

	/*
	 * getBroadcast()
	 * @return bool
	 * Determines if we're in interface or broadcast mode.
	 */
	getBroadcast() {
		return this.config.broadcast;
	}

	/*
	 * toggleInterface()
	 * @return bool
	 * Toggles between having dev tools on or off.
	 */
	toggleDevtools() {
		this.config.devTools = !this.config.devTools;
		this.save();
		return this.config.devTools;
	}

	/*
	 * getInterface()
	 * @return bool
	 * Determines if dev tools are opened.
	 */
	getDevTools() {
		return this.config.devTools;
	}

	/*
	 * setProfile(id)
	 * @param integer id
	 * @return integer
	 * Sets the profile currently being used in OJD
	 */
	setProfile(id: string | number) {
		this.config.profile = typeof id === "string" ? parseInt(id, 10) : id;
		this.save();
		return this.config.profile;
	}

	/*
	 * getProfile()
	 * @return integer
	 * Returns the profile id set.
	 */
	getProfile() {
		return this.config.profile;
	}

	/*
	 * setUserThemeDirectory(id)
	 * @param string directory
	 * @return string
	 * Sets the custom theme directory.
	 */
	setUserThemeDirectory(directory: string) {
		this.config.themeUserDirectory = directory;
		this.save();
		return this.config.themeUserDirectory;
	}

	/*
	 * getUserThemeDirectory()
	 * @return string
	 * Returns the current custom theme directory.
	 */
	getUserThemeDirectory() {
		return this.config.themeUserDirectory;
	}

	/*
	 * save()
	 * @return NULL
	 * Saves config object
	 */
	save() {
		store.set('config', this.config);
	}

	/*
	 * reset()
	 * @return bool
	 * Alias of init.
	 */
	reset() {
		return this.init(true);
	}

	debugEnabled() {
		return false;
	}
}
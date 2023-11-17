import store from "store";
import Config from "./config.class";
import { DataProfile } from "./data";
import Mappings from "./mappings.class";
import clone from "clone";

import profileJson from "../data/profile.json";

/*
	Class Profiles
	Handles broadcast profiles for the OJD user.
*/
export default class Profiles {
	config: Config;
	mappings: Mappings;
	profiles: DataProfile[];
	profile!: DataProfile;

	constructor(config: Config, mappings: Mappings) {
		this.config = config;
		this.mappings = mappings;
		this.profiles = store.get('profiles');
		this.setCurrentProfile(this.getCurrentProfileId()!);
	}

	/* 
		///////////////////////////
				Getters
			///////////////////////////
	*/

	/*
	 * getCurrentProfile()
	 * @return object
	 * Gets the current profile object.
	 */
	getCurrentProfile() {
		return this.profile;
	}

	/*
	 * getCurrentProfileId()
	 * @return integer
	 * Returns the current profile id
	 */
	getCurrentProfileId() {
		return this.config.getProfile();
	}

	/*
	 * getCurrentProfileMapping()
	 * @return object
	 * Returns the current mapping for the profile.
	 */
	getCurrentProfileMapping() {
		return this.mappings.getMapping(this.getCurrentProfileMap());
	}

	/*
	 * getCurrentProfileMap()
	 * @return integer
	 * Returns the current map id for the profile.
	 */
	getCurrentProfileMap() {
		return this.profile.map;
	}

	/*
	 * getCurrentProfileTheme()
	 * @return string
	 * Returns the current theme id for the profile.
	 */
	getCurrentProfileTheme() {
		return this.profile.theme;
	}

	/*
	 * getCurrentProfileThemeStyle()
	 * @return string
	 * Returns the current theme style id for the profile.
	 */
	getCurrentProfileThemeStyle() {
		return this.profile.themeStyle;
	}

	/*
	 * getCurrentProfileAlwaysOnTop()
	 * @return bool
	 * Returns the current state of always on top for the profile.
	 */
	getCurrentProfileAlwaysOnTop() {
		return this.profile.alwaysOnTop;
	}

	/*
	 * getCurrentProfileChroma()
	 * @return bool
	 * Returns the current state of chroma for the profile.
	 */
	getCurrentProfileChroma() {
		return this.profile.chroma;
	}

	/*
	 * getCurrentProfileBounds()
	 * @return object
	 * Returns the current broadcast window bounds of the profile.
	 */
	getCurrentProfileBounds() {
		return this.profile.bounds;
	}

	/*
	 * getCurrentProfileChromaColor()
	 * @return string
	 * Returns the current color of chroma for the profile.
	 */
	getCurrentProfileChromaColor() {
		return this.profile.chromaColor;
	}

	/*
	 * getCurrentProfileZoom()
	 * @return bool
	 * Returns the current zoom for the profile.
	 */
	getCurrentProfileZoom() {
		return this.profile.zoom;
	}

	/*
	 * getCurrentProfilePoll()
	 * @return bool
	 * Returns the current poll rate for the profile.
	 */
	getCurrentProfilePoll() {
		return this.profile.poll;
	}

	/*
	 * getCurrentProfileBoundsLock()
	 * @return bool
	 * Returns if the broadcast window size is locked
	 */
	getCurrentProfileBoundsLock() {
		return this.profile.boundsLock;
	}

	/*
	 * getCurrentProfileDriver()
	 * @return string
	 * Gets the current profile driver.
	 */
	getCurrentProfileDriver() {
		let driver = this.profile.driver;
		if (typeof driver === 'undefined' || !driver) {
			this.setProfileDriver('network');
			driver = 'network';
		}
		return driver;
	}

	/*
	 * getCurrentProfilePlayer()
	 * @return string
	 * Sets the current player for the OS driver
	 */
	getCurrentProfilePlayer() {
		let player = this.profile.player;
		if (typeof player === 'undefined' || !player) {
			this.setProfilePlayer('0');
			player = 0;
		}
		return player;
	}

	/*
	 * getCurrentProfileDriverPort()
	 * @return string
	 * Gets the current profile driver port.
	 */
	getCurrentProfileDriverPort() {
		return this.profile.driverPort;
	}

	/*
	 * getCurrentProfileDriverDevice()
	 * @return string
	 * Gets the current profile driver device.
	 */
	getCurrentProfileDriverDevice() {
		return this.profile.driverDevice;
	}

	/*
	 * getCurrentProfileDriverUri()
	 * @return string
	 * Gets the current profile driver uri.
	 */
	getCurrentProfileDriverUri() {
		return this.profile.driverUri;
	}

	/*
	 * getProfile(id)
	 * @param integer id
	 * @return object
	 * Returns a profile by id.
	 */
	getProfile(id: number | string) {
		if (typeof id === "string") id = parseInt(id, 10);
		return this.profiles[id];
	}

	/*
	 * getProfile(id)
	 * @return array
	 * Returns all profiles
	 */
	getProfiles() {
		return this.profiles;
	}

	/* 
		///////////////////////////
				Setters
			///////////////////////////
	*/

	/*
	 * setCurrentProfile(id)
	 * @param integer id
	 * @return object
	 * Sets the selected profile and returns the profile object.
	 */
	setCurrentProfile(id: number | string) {
		if (typeof id === "string") id = parseInt(id, 10);
		id = this.config.setProfile(id);
		this.profile = this.profiles[id];
		this.config.setProfile(id);
		return this.profile;
	}

	/*
	 * setProfileName(id)
	 * @param string name
	 * @return NULL
	 * Sets the selected profile name.
	 */
	setProfileName(name: string) {
		this.profile.name = name;
		this.saveCurrent();
	}

	/*
	 * setProfileMap(id)
	 * @param integer id
	 * @return NULL
	 * Sets the selected profile map id.
	 */
	setProfileMap(id: number | string) {
		if (typeof id === "string") id = parseInt(id, 10);
		this.profile.map = id;
		this.saveCurrent();
	}

	/*
	 * setProfileTheme(id)
	 * @param string id
	 * @return NULL
	 * Sets the selected profile theme id.
	 */
	setProfileTheme(id: string) {
		this.profile.theme = id;
		this.saveCurrent();
	}

	/*
	 * setProfileDriverUri(id)
	 * @param string id
	 * @return NULL
	 * Sets the selected profile driver URI.
	 */
	setProfileDriverUri(uri: string) {
		this.profile.driverUri = uri;
		this.saveCurrent();
	}

	/*
	 * setProfileThemeStyle(id)
	 * @param string id
	 * @return NULL
	 * Sets the selected profile theme style id.
	 */
	setProfileThemeStyle(id: number) {
		this.profile.themeStyle = id;
		this.saveCurrent();
	}

	/*
	 * toggleBoundsLock()
	 * @return bool
	 * Toggles boundsLock, returns new value.
	 */
	toggleProfileBoundsLock() {
		this.profile.boundsLock = !this.profile.boundsLock;
		this.saveCurrent();
		return this.profile.boundsLock;
	}

	/*
	 * toggleProfileAlwaysOnTop()
	 * @return bool
	 * Toggles alwaysOnTop, returns new value.
	 */
	toggleProfileAlwaysOnTop() {
		this.profile.alwaysOnTop = !this.profile.alwaysOnTop;
		this.saveCurrent();
		return this.profile.alwaysOnTop;
	}

	/*
	 * toggleProfileChroma()
	 * @return bool
	 * Toggles chroma, returns new value.
	 */
	toggleProfileChroma() {
		this.profile.chroma = !this.profile.chroma;
		this.saveCurrent();
		return this.profile.chroma;
	}

	/*
	 * setProfileChromaColor(color)
	 * @param string color
	 * @return NULL
	 * Sets the selected profile chroma color.
	 */
	setProfileChromaColor(color: string) {
		this.profile.chromaColor = color;
		this.saveCurrent();
	}

	/*
	 * setProfileDriver(driver)
	 * @param string driver
	 * @return NULL
	 * Sets the profile driver
	 */
	setProfileDriver(driver: string) {
		if (driver === 'network') {
			this.profile.driver = 'network';
			this.profile.driverPort = '';
			this.profile.driverDevice = '';
			this.profile.driverUri = '127.0.0.1';
		}

		this.saveCurrent();
	}

	/*
	 * setProfilePlayer(port)
	 * @param string player
	 * @return NULL
	 * Sets the profile player port for chromium driver
	 */
	setProfilePlayer(player: number | string) {
		if (typeof player === "string") player = parseInt(player, 10);
		this.profile.player = player;
		this.saveCurrent();
	}
	/*
	 * setProfileDriverPort(port)
	 * @param string port
	 * @return NULL
	 * Sets the profile driver port
	 */
	setProfileDriverPort(port: string) {
		this.profile.driverPort = port;
		this.saveCurrent();
	}

	/*
	 * setProfileDriverDevice(device)
	 * @param string device
	 * @return NULL
	 * Sets the profile driver device
	 *
	setProfileDriverDevice(device) {
		this.profile.driverDevice = device;
		this.saveCurrent();
	}*/

	/*
	 * setProfilePoll(value)
	 * @param integer value
	 * @return integer
	 * Sets the selected profile poll rate (ms) value. Returns corrected value if need be.
	 */
	setProfilePoll(value: number | string) {
		if (typeof value === "string") value = parseInt(value, 10);
		if (value < 1) {
			value = 1;
		} else if (value > 100) {
			value = 100;
		}
		this.profile.poll = value;
		this.saveCurrent();
		return value;
	}

	/*
	 * setProfileZoom(zoom)
	 * @param float zoom
	 * @return float
	 * Sets the selected profile zoom. Returns correct value if need be.
	 */
	setProfileZoom(zoom: number | string) {
		if (typeof zoom === "string") zoom = parseInt(zoom);
		if (zoom < 25) {
			zoom = 25;
		} else if (zoom > 300) {
			zoom = 300;
		}
		this.profile.zoom = zoom;
		this.saveCurrent();
		return zoom;
	}

	/* 
		///////////////////////////
				Operators
			///////////////////////////
	*/

	/*
	 * create()
	 * @return integer
	 * Creates a new blank template profile.
	 */
	create() {
		const id = this.profiles.length; // Will always be one ahead. Thanks zero index;
		const profile = clone(profileJson);
		this.profiles.push(profile);
		this.setCurrentProfile(id);
		this.save();
		return id;
	}

	/*
	 * clone(id)
	 * @param integer id
	 * @return integer
	 * Creates a new profile based on a previous profile.
	 */
	clone(id: number) {
		const newId = this.profiles.length;
		const profile = clone(this.getProfile(id));
		profile.name = profile.name + ' (Cloned)';
		this.profiles.push(profile);
		this.setCurrentProfile(newId);
		this.save();
		return newId;
	}

	/*
	 * remove(id)
	 * @param integer id
	 * @return integer
	 * Removes a profile. If all are removed, a new one will be created in its place.
	 */
	remove(id: number) {
		this.profiles.splice(id, 1);
		if (this.profiles.length === 0) {
			this.create();
		}
		this.setCurrentProfile(0);
		this.save();
		return 0;
	}


	/*
	 * saveCurrent()
	 * @return NULL
	 * Saves the current profile to the storage.
	 */
	saveCurrent() {
		const id = this.getCurrentProfileId()!;
		this.profiles[id] = this.profile;
		this.save();
	}

	/*
	 * save()
	 * @return NULL
	 * Saves all profiles
	 */
	save() {
		store.set('profiles', this.profiles);
	}

}
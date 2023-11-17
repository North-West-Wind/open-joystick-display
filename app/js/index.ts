import $ from "jquery";
import OJD from "./ojd";
import Config from "./classes/config.class";
import Joystick from "./classes/joystick.class";
import Mappings from "./classes/mappings.class";
import Profiles from "./classes/profiles.class";
import Themes from "./classes/themes.class";
import RootController from "./classes/controllers/root.controller";

// Load Tools Globally
export const ojd = new OJD();

// Load Application
$(function () {
	const config = new Config();
	ojd.setConfig(config);
	const mappings = new Mappings(config);
	const profiles = new Profiles(config, mappings);
	const joystick = new Joystick(config, profiles);
	const themes = new Themes(config, profiles);
	const rootController = new RootController(config, themes, mappings, joystick, profiles);
});


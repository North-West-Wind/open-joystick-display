import { setTitle } from "../../comm.js";
import Config from "../config.class.js";
import Joystick from "../joystick.class.js";
import Mappings from "../mappings.class.js";
import Profiles from "../profiles.class.js";
import Themes from "../themes.class.js";

const FS = require('fs');
const { remote, shell } = require('electron');
const dialog = remote.require('electron').dialog;
const OJD = window.OJD;
const Clone = require('clone');

const { MapperController } = require(OJD.appendCwdPath('app/js/classes/controllers/mapper.controller.js'));
const { ProfileController } = require(OJD.appendCwdPath('app/js/classes/controllers/profile.controller.js'));
const { TesterController } = require(OJD.appendCwdPath('app/js/classes/controllers/tester.controller.js'));
const { ThemeController } = require(OJD.appendCwdPath('app/js/classes/controllers/theme.controller.js'));
const { ToolbarController } = require(OJD.appendCwdPath('app/js/classes/controllers/toolbar.controller.js'));

class RootController {
	config: Config;
	themes: Themes;
	mappings: Mappings;
	joystick: Joystick;
	profiles: Profiles;
	loadInterval: NodeJS.Timeout;

	constructor(config: Config, themes: Themes, mappings: Mappings, joystick: Joystick, profiles: Profiles) {

		this.electron = {
			shell: shell,
			dialog: dialog,
			remote: remote,
			window: remote.getCurrentWindow()
		};

		this.config = config;
		this.joystick = joystick;
		this.profiles = profiles;
		this.themes = themes;
		this.mappings = mappings;

		// Broadcast should be off on load.
		this.config.config.broadcast = false;
		this.config.save();

		this.controllers = {
			main: this,
			mapper: new MapperController(this),
			profile: new ProfileController(this),
			tester: new TesterController(this),
			theme: new ThemeController(this),
			toolbar: new ToolbarController(this)
		};

		setTitle("Open Joystick Display - ESC to Toggle Broadcast Mode");

		this.loadInterval = setInterval(() => {
			if (!this.joystick.isReady()) {
				return;
			}

			clearInterval(this.loadInterval);

			this.renderInitial();
		}, 50);

	}

	onToggleBroadcast(e) {
		if (e.key === "Escape") {
			if (this.controllers.toolbar.aboutDialog) {
				this.controllers.toolbar.onAbout();
			} else {
				this.config.toggleBroadcast();
				this.renderBroadcast();
			}
		}
	}

	renderBroadcast() {
		const broadcast = this.config.getBroadcast();
		const bounds = remote.getCurrentWindow().getBounds();
		if (broadcast) {
			$("*[ojd-broadcast]").addClass('ojd-broadcast-mode');
			remote.getCurrentWindow().setBounds(this.profiles.getCurrentProfileBounds());
			if (this.profiles.getCurrentProfileBoundsLock()) {
				remote.getCurrentWindow().setResizable(false);
			}
			if (this.profiles.getCurrentProfileAlwaysOnTop()) {
				remote.getCurrentWindow().setAlwaysOnTop(true);
			}
		} else {
			$("*[ojd-broadcast]").removeClass('ojd-broadcast-mode');
			remote.getCurrentWindow().setBounds(this.config.getBounds());
			remote.getCurrentWindow().setResizable(true);
			remote.getCurrentWindow().setAlwaysOnTop(false);
			this.reloadProfile();
		}
	}

	openDirectoryDialog() {
		const path = dialog.showOpenDialog({
			properties: ['openDirectory']
		});

		if (path === undefined) {
			return false;
		}

		return path[0];
	}

	reloadTester() {
		this.controllers.tester.render();
	}

	reloadTheme() {
		this.controllers.theme.render();
	}

	reloadMapper() {
		this.controllers.mapper.render();
	}

	reloadProfile() {
		this.controllers.profile.render();
	}

	renderInitial() {

		const argv = remote.getGlobal('sharedObject').argv;
		let startInBroadcastMode = false;

		for (const arg of argv) {
			if (arg === '--start-broadcast-mode') {
				startInBroadcastMode = true;
			}
		}

		this.controllers.toolbar.renderInitial();
		this.controllers.profile.renderInitial();
		this.controllers.mapper.renderInitial();
		this.controllers.tester.renderInitial();
		this.controllers.theme.renderInitial();
		$(window).bind('keyup', this.onToggleBroadcast.bind(this));
		$(".ojd-external-link").bind('click', this.onExternalLink.bind(this));

		if (startInBroadcastMode) {
			this.config.toggleBroadcast();
			this.renderBroadcast();
		}

	}

}


module.exports.RootController = RootController;

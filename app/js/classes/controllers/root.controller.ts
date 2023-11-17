import $ from "jquery";
import Config from "../config.class";
import Joystick from "../joystick.class";
import Mappings from "../mappings.class";
import Profiles from "../profiles.class";
import Themes from "../themes.class";
import MapperController from "./mapper.controller";
import ProfileController from "./profile.controller";
import TesterController from "./tester.controller";
import ThemeController from "./theme.controller";
import ToolbarController from "./toolbar.controller";

export default class RootController {
	config: Config;
	themes: Themes;
	mappings: Mappings;
	joystick: Joystick;
	profiles: Profiles;
	controllers: {
		main: RootController;
		mapper: MapperController;
		profile: ProfileController;
		tester: TesterController;
		theme: ThemeController;
		toolbar: ToolbarController;
	};
	loadInterval: NodeJS.Timeout;

	constructor(config: Config, themes: Themes, mappings: Mappings, joystick: Joystick, profiles: Profiles) {
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

		document.title = "Open Joystick Display - ESC to Toggle Broadcast Mode";

		this.loadInterval = setInterval(() => {
			if (!this.joystick.isReady()) {
				return;
			}

			clearInterval(this.loadInterval);

			this.renderInitial();
		}, 50);

	}

	onToggleBroadcast(e: KeyboardEvent) {
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
		if (broadcast) {
			$("*[ojd-broadcast]").addClass('ojd-broadcast-mode');
		} else {
			$("*[ojd-broadcast]").removeClass('ojd-broadcast-mode');
			this.reloadProfile();
		}
	}

	async openDirectoryDialog() {
		return new Promise<undefined | string>(res => {
			let input = document.createElement('input');
			input.setAttribute("webkitdirectory", "");
			input.setAttribute("directory", "");
			input.type = 'file';
			input.onchange = e => {
				const files = (<HTMLInputElement>e.target).files;
				input.remove();
				if (!files || !files[0]) res(undefined);
				else res(files[0].webkitRelativePath);
			}
			input.click();
		});
	}

	reloadTester() {
		this.controllers.tester.render();
	}

	async reloadTheme() {
		await this.controllers.theme.render();
	}

	reloadMapper() {
		this.controllers.mapper.render();
	}

	reloadProfile() {
		this.controllers.profile.render();
	}

	async renderInitial() {

		await this.controllers.toolbar.renderInitial();
		await this.controllers.profile.renderInitial();
		await this.controllers.mapper.renderInitial();
		await this.controllers.tester.renderInitial();
		this.controllers.theme.renderInitial();
		$(window).bind('keyup', e => this.onToggleBroadcast(<KeyboardEvent><unknown>e));
		if (window.location.hash == "#broadcast" && !this.config.getBroadcast()) this.config.toggleBroadcast();
		this.renderBroadcast();
	}

}
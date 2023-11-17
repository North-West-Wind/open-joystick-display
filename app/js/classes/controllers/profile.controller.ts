import $ from "jquery";
import * as path from "path";
import { ojd } from "../..";
import Joystick from "../joystick.class";
import Mappings from "../mappings.class";
import Profiles from "../profiles.class";
import Themes from "../themes.class";
import RootController from "./root.controller";

/*
	Class ProfileController
	Renders and binds events to the profile sidebar.
*/
export default class ProfileController {
	rootId = '#ojd-profile';
	objectIds = {
		profileMenu: '#ojd-profile-current',
		profileCreate: '#ojd-profile-create',
		profileClone: '#ojd-profile-clone',
		profileDelete: '#ojd-profile-delete',
		themeFolder: '#ojd-profile-theme-folder',
		themeFolderLabel: '#ojd-profile-folder-label',
		mapCreate: '#ojd-profile-map-create',
		mapClone: '#ojd-profile-map-clone',
		mapDelete: '#ojd-profile-map-delete',
		driverRefresh: '#ojd-profile-driver-refresh',
		driverReload: '#ojd-profile-driver-reload',
		driverReconnect: '#ojd-profile-driver-reconnect',
		driverNetwork: '*[ojd-driver-network]'
	};
	rootController: RootController;
	themes: Themes;
	mappings: Mappings;
	joystick: Joystick;
	profiles: Profiles;

	constructor(rootController: RootController) {
		this.rootController = rootController;
		this.profiles = rootController.profiles;
		this.themes = rootController.themes;
		this.mappings = rootController.mappings;
		this.joystick = rootController.joystick;
	}

	/*
	 * bindEvents() 
	 * @return NULL
	 * Rebinds events on render.
	*/
	bindEvents() {

		// Input Events
		$(`${this.rootId} *[ojd-profile-event-input]`).unbind('keyup');
		$(`${this.rootId} *[ojd-profile-event-input]`).unbind('change');
		$(`${this.rootId} *[ojd-profile-event-slider]`).unbind('input');
		$(`${this.rootId} *[ojd-profile-event-select]`).unbind('change');
		$(`${this.rootId} *[ojd-profile-event-toggle]`).unbind('click');


		$(`${this.rootId} *[ojd-profile-event-input]`).bind('keyup', e => this.onKeyUp(<KeyboardEvent><unknown>e));
		$(`${this.rootId} *[ojd-profile-event-input]`).bind('change', e => this.onInput(<Event><unknown>e));
		$(`${this.rootId} *[ojd-profile-event-slider]`).bind('input', e => this.onInput(<Event><unknown>e));
		$(`${this.rootId} *[ojd-profile-event-select]`).bind('change', e => this.onSelect(<Event><unknown>e));
		$(`${this.rootId} *[ojd-profile-event-toggle]`).bind('click', e => this.onToggle(<Event><unknown>e));

		// Static Events
		$(`${this.rootId} ${this.objectIds.profileMenu}`).unbind('change');
		$(`${this.rootId} ${this.objectIds.profileCreate}`).unbind('click');
		$(`${this.rootId} ${this.objectIds.profileClone}`).unbind('click');
		$(`${this.rootId} ${this.objectIds.profileDelete}`).unbind('click');
		//$(`${this.rootId} ${this.objectIds.themeFolder}`).unbind('click');
		$(`${this.rootId} ${this.objectIds.mapCreate}`).unbind('click');
		$(`${this.rootId} ${this.objectIds.mapClone}`).unbind('click');
		$(`${this.rootId} ${this.objectIds.mapDelete}`).unbind('click');
		$(`${this.rootId} ${this.objectIds.driverRefresh}`).unbind('click');
		$(`${this.rootId} ${this.objectIds.driverReload}`).unbind('click');

		$(`${this.rootId} ${this.objectIds.profileMenu}`).bind('change', e => this.onChangeProfile(<Event><unknown>e));
		$(`${this.rootId} ${this.objectIds.profileCreate}`).bind('click', this.onCreateProfile.bind(this));
		$(`${this.rootId} ${this.objectIds.profileClone}`).bind('click', this.onCloneProfile.bind(this));
		$(`${this.rootId} ${this.objectIds.profileDelete}`).bind('click', this.onDeleteProfile.bind(this));
		//$(`${this.rootId} ${this.objectIds.themeFolder}`).bind('click', this.onSelectThemeFolder.bind(this));
		$(`${this.rootId} ${this.objectIds.mapCreate}`).bind('click', this.onCreateMap.bind(this));
		$(`${this.rootId} ${this.objectIds.mapClone}`).bind('click', this.onCloneMap.bind(this));
		$(`${this.rootId} ${this.objectIds.mapDelete}`).bind('click', this.onDeleteMap.bind(this));
		$(`${this.rootId} ${this.objectIds.driverRefresh}`).bind('click', this.onDriverRefresh.bind(this));
		$(`${this.rootId} ${this.objectIds.driverReload}`).bind('click', this.onDriverReload.bind(this));
		$(`${this.rootId} ${this.objectIds.driverReconnect}`).bind('click', this.onDriverReload.bind(this));

	}

	/*
	 * onInput(e)
	 * @param event e
	 * @return NULL
	 * When a input field in the sidebar is edited it will update the profile and render the changes.
	 */
	async onInput(e: Event) {
		const $e = $(e.target!);
		const key = $e.attr('ojd-profile-data');
		const value = $e.val();

		if (key === 'chromaColor') {
			this.profiles.setProfileChromaColor(<string>value);
		} else if (key === 'zoom') {
			this.profiles.setProfileZoom(<string>value);
		} else if (key === 'poll') {
			this.profiles.setProfilePoll(<string>value);
			this.joystick.updatePollRate();
		} else if (key === 'name') {
			this.profiles.setProfileName(<string>value);
		} else if (key === 'driverUri') {
			this.profiles.setProfileDriverUri(<string>value);
		} else {
			return;
		}

		await this.render();

	}

	async onKeyUp(e: KeyboardEvent) {
		const $e = $(e.target!);
		const key = $e.attr('ojd-profile-data');
		const value = $e.val();

		if (key === "home") {
			if (e.key === "Enter") {
				await this.themes.setUserThemeDirectory(<string>value);
				await this.render();
			}
		} else this.onInput(e);
	}

	/*
	 * onSelect(e)
	 * @param event e
	 * @return NULL
	 * When a select field in the sidebar is edited it will update the profile and render the changes.
	 */
	onSelect(e: Event) {
		const $e = $(e.target!);
		const key = $e.attr('ojd-profile-data');
		const value = $e.val();

		if (key === 'theme') {
			if (value !== '') {
				this.profiles.setProfileTheme(<string>value);
				this.profiles.setProfileThemeStyle(0);
			}
			// @todo add theme.render();
		} else if (key === 'themeStyle') {
			if (value !== '') {
				this.profiles.setProfileThemeStyle(<number>value);
			}
			// @todo add theme.render();
		} else if (key === 'map') {
			this.profiles.setProfileMap(<string>value);
			this.rootController.reloadMapper();
		} else if (key === 'player') {
			this.profiles.setProfilePlayer(<string>value);
			this.joystick.reloadDriver();
			this.rootController.reloadTester();
		} else if (key === 'driver') {
			this.profiles.setProfileDriver(<string>value);
			this.joystick.reloadDriver();
			this.rootController.reloadTester();
		} else if (key === 'driverPort') {
			this.profiles.setProfileDriverPort(<string>value);
			this.joystick.reloadDriver();
			this.rootController.reloadTester();
		}/* else if (key === 'driverDevice') {
			this.profiles.setProfileDriverDevice(value);
			this.joystick.reloadDriver();
			this.rootController.reloadTester();
		}*/ else {
			return;
		}

		this.render();
	}

	/*
	 * onToggle(e)
	 * @param event e
	 * @return NULL
	 * When a toggle button in the sidebar is edited it will update the profile and render the changes.
	 */
	onToggle(e: Event) {

		const $e = $(e.currentTarget!);
		const key = $e.attr('ojd-profile-data');
		const value = $e.val();

		if (key === 'boundsLock') {
			this.profiles.toggleProfileBoundsLock();
		} else if (key === 'chroma') {
			this.profiles.toggleProfileChroma();
		} else if (key === 'alwaysOnTop') {
			this.profiles.toggleProfileAlwaysOnTop();
		} else {
			return;
		}

		this.render();

	}

	/*
	 * onChangeProfile(e)
	 * @param event e
	 * @return NULL
	 * Update current profile
	 */
	onChangeProfile(e: Event) {
		const id = (<HTMLInputElement>e.target).value;
		this.profiles.setCurrentProfile(id);
		this.rootController.reloadMapper();
		this.joystick.reloadDriver();
		this.rootController.reloadTester();
		this.render();
	}

	/*
	 * onCreateProfile(e)
	 * @param event e
	 * @return NULL
	 * Update new profile
	 */
	onCreateProfile() {
		this.profiles.create();
		this.rootController.reloadMapper();
		this.joystick.reloadDriver();
		this.rootController.reloadTester();
		this.render();
	}

	/*
	 * onCloneProfile(e)
	 * @param event e
	 * @return NULL
	 * Clone current profile
	 */
	onCloneProfile() {
		this.profiles.clone(this.profiles.getCurrentProfileId()!);
		this.rootController.reloadMapper();
		this.joystick.reloadDriver();
		this.rootController.reloadTester();
		this.render();
	}

	/*
	 * onDeleteProfile(e)
	 * @param event e
	 * @return NULL
	 * Delete current profile
	 */
	onDeleteProfile() {
		if (confirm("Do you wish to delete this profile? This action cannot be undone.")) {
			this.profiles.remove(this.profiles.getCurrentProfileId()!);
			this.rootController.reloadMapper();
			this.joystick.reloadDriver();
			this.render();
		}
	}

	/*
	 * onCreateMap(e)
	 * @param event e
	 * @return NULL
	 * Create a new mapping
	 */
	onCreateMap() {
		const id = this.mappings.create();
		this.profiles.setProfileMap(id);
		this.rootController.reloadMapper();
		this.render();
	}

	/*
	 * onCloneMap(e)
	 * @param event e
	 * @return NULL
	 * Clone current mapping
	 */
	onCloneMap() {
		const id = this.mappings.clone(this.profiles.getCurrentProfileMap());
		this.profiles.setProfileMap(id);
		this.rootController.reloadMapper();
		this.render();
	}

	/*
	 * onDeleteMap(e)
	 * @param event e
	 * @return NULL
	 * Delete current mapping
	 */
	onDeleteMap() {
		const id = this.mappings.remove(this.profiles.getCurrentProfileMap());
		this.profiles.setProfileMap(id);
		this.rootController.reloadMapper();
		this.render();
	}

	/*
	 * onSelectThemeFolder(e)
	 * @param event e
	 * @return NULL
	 * Updates the user theme folder.
	 *
	async onSelectThemeFolder() {
		const folder = await this.rootController.openDirectoryDialog();
		if (folder !== undefined) {
			this.themes.setUserThemeDirectory(path.dirname(path.join(this.profiles.getCurrentProfileHomeDirectory() || "", folder)));
			this.render();
		}
	}
	*/

	/*
	 * onDriverRefresh(e)
	 * @param event e
	 * @return NULL
	 * Updates the drivers avaliable ports.
	 */
	async onDriverRefresh() {
		await this.joystick.reloadPorts();
		this.render();
	}

	/*
	 * onDriverReload(e)
	 * @param event e
	 * @return NULL
	 * Reloads the driver to a clean state. Used for RetroSpy generally.
	 */
	async onDriverReload() {
		this.onDriverRefresh();
		this.joystick.reloadDriver();
		this.render();
	}

	/*
	 * renderCSSOverrides()
	 * @return NULL
	 * Renders any CSS overrides required for the profile. Chroma being one of them.
	 */
	renderCSSOverrides() {

		let css = "";

		if (this.profiles.getCurrentProfileChroma()) {
			const chromaColor = this.profiles.getCurrentProfileChromaColor();
			css += `body{background:${chromaColor} !important;}`;
		}

		const zoom = this.profiles.getCurrentProfileZoom();
		if (zoom != 1) {
			css += `#ojd-theme-contents{transform: scale(${zoom / 100});}`;
		}

		$("#ojd-profile-css-overrides").html(css);

	}


	/*
	 * renderFields()
	 * @return NULL
	 * Renders all of the fields in the profile
	 */
	renderFields() {

		const profile = this.profiles.getCurrentProfile();
		const $inputs = $(`${this.rootId} *[ojd-profile-event-input]`);
		const $sliders = $(`${this.rootId} *[ojd-profile-event-slider]`)
		const $fields = [...$inputs, ...$sliders];

		// Input Fields
		for (const field of $fields) {
			const $field = $(field);
			const key = $field.attr('ojd-profile-data')!;
			if (key.includes('bounds')) {
				/* You can't set browser bounds
				const keyBounds = key.replace('bounds.', '');
				$field.val(OJD.escapeText(profile.bounds[keyBounds]));
				*/
			} else {
				$field.val(ojd.escapeText((<any>profile)[key]));
				const label = $field.attr('ojd-profile-data-label');
				if (label) {
					$(`${this.rootId} #ojd-profile-label-${label}`).html(ojd.escapeText((<any>profile)[key]));
				}
			}
		}

		// Toggles
		const $toggles = $(`${this.rootId} *[ojd-profile-event-toggle]`);
		for (const toggle of $toggles) {
			const $toggle = $(toggle);
			const key = $($toggle).attr('ojd-profile-data')!;
			if ((<any>profile)[key]) {
				$toggle.addClass('ojd-button-active');
			} else {
				$toggle.removeClass('ojd-button-active');
			}
		}

	}


	/*
	 * renderProfilesMenu()
	 * @return NULL
	 * Renders the profiles menu for the profile
	 */
	renderProfilesMenu() {
		const profiles = this.profiles.getProfiles();
		const $menu = $(`${this.rootId} ${this.objectIds.profileMenu}`);
		$menu.html('');
		for (const key in profiles) {
			const profile = profiles[key];
			$menu.append($('<option/>').val(ojd.escapeText(key)).html(ojd.escapeText(profile.name)));
		}
		$menu.val(this.profiles.getCurrentProfileId()!);
	}

	/*
	 * renderThemesMenu()
	 * @return NULL
	 * Renders the theme menu for the profile
	 */
	async renderThemesMenu() {

		await this.themes.ensureLoaded();
		const profile = this.profiles.getCurrentProfile();
		const themes = this.themes.getThemes();
		const $menu = $(`${this.rootId} select[ojd-profile-data='theme']`);
		const $menuStyle = $(`${this.rootId} select[ojd-profile-data='themeStyle']`);
		$menu.html('');
		$menuStyle.html('');

		/*
			Render Theme Menu
		*/
		$menu.append($('<option/>').val('').html('System Themes:').addClass('ojd-option-header'));
		for (const key in themes) {
			const theme = themes[key];
			if (!theme.user) {
				$menu.append($('<option/>').val(ojd.escapeText(theme.id)).html(ojd.escapeText(theme.name)));
			}
		}
		$menu.append($('<option/>').val('').html('User Themes:').addClass('ojd-option-header'));
		for (const key in themes) {
			const theme = themes[key];
			if (theme.user) {
				$menu.append($('<option/>').val(ojd.escapeText(theme.id)).html(ojd.escapeText(theme.name)));
			}
		}
		$menu.val(profile.theme);

		/*
			Render Theme Styles
		*/
		try {
			const theme = themes[profile.theme];
			if (theme.styles && theme.styles.length !== 0) {
				$menuStyle.parent().show();
				for (const key in theme.styles) {
					const style = theme.styles[key];
					$menuStyle.append($('<option/>').val(key).html(ojd.escapeText(style.name)));
				}
				$menuStyle.val(profile.themeStyle);
			} else {
				$menuStyle.parent().hide();
			}
		} catch (err) {
			console.error("Couldn't load theme style list");
			console.error(err);
		}

		/* Themes Directory */
		let themeDir = this.themes.getUserThemeDirectory();
		if (themeDir === undefined) {
			themeDir = '';
		}

		$(`${this.rootId} input[ojd-profile-data='home']`).val(ojd.escapeText(themeDir));

	}

	/*
	 * renderMappingsMenu()
	 * @return NULL
	 * Renders the mapping menu for the profile
	 */
	renderMappingsMenu() {

		const profile = this.profiles.getCurrentProfile();
		const mappings = this.mappings.getMappings();
		const $menu = $(`${this.rootId} select[ojd-profile-data='map']`);
		$menu.html('');

		for (const key in mappings) {
			const map = mappings[key];
			$menu.append($('<option/>').val(key).html(map.name));
		}

		$menu.val(profile.map);

	}

	/*
	 * renderDriversMenu()
	 * @return NULL
	 * Renders the new driver menu for retrospy and future devices.
	 */
	renderDriversMenu() {

		// Get Values
		const profile = this.profiles.getCurrentProfile();
		const ports = this.joystick.getSupportedPorts();
		const devices = this.joystick.getSupportedDevices();
		const $driverMenu = $(`${this.rootId} select[ojd-profile-data='driver']`);
		const $driverPortMenu = $(`${this.rootId} select[ojd-profile-data='driverPort']`);
		const $driverDeviceMenu = $(`${this.rootId} select[ojd-profile-data='driverDevice']`);
		const $driverUri = $(`${this.rootId} select[ojd-profile-data='driverUri']`);
		const $driverNetwork = $(`${this.rootId} ${this.objectIds.driverNetwork}`);
		const $playerDeviceSection = $(`${this.rootId} div[ojd-driver-chromium-player]`);
		const $playerDeviceMenu = $(`${this.rootId} select[ojd-profile-data='player']`);

		// Driver Menu
		$driverMenu.val(profile.driver);
		$driverUri.val(profile.driverUri); +
		$playerDeviceMenu.val(this.profiles.getCurrentProfilePlayer());
		$driverPortMenu.html('');
		$driverDeviceMenu.html('');

		// Load Ports
		/* ports is always null
		if (ports) {
			$driverPortMenu.append($('<option/>').val('').html('No Port Selected'));

			let found = false;
			for (const port of ports) {
				if (profile.driverPort === port.value) {
					found = true;
				}
				$driverPortMenu.append($('<option/>').val(port.value).html(port.label));
			}

			if (!found) {
				this.profiles.setProfileDriverPort('');
				this.joystick.reloadDriver();
			} else {
				$driverPortMenu.val(profile.driverPort);
			}

			$(this.objectIds.driverRefresh).show();
			$(this.objectIds.driverReload).show();
			$($driverPortMenu).parent().show();

		} else {
		*/
		$(this.objectIds.driverRefresh).hide();
		$(this.objectIds.driverReload).hide();
		$($driverPortMenu).parent().hide();
		/*}*/

		// Load Devices
		/* devices is always null
		if (devices) {
			for (const device of devices) {
				$driverDeviceMenu.append($('<option/>').val(device.value).html(device.label));
			}
			$driverDeviceMenu.val(profile.driverDevice);
			$($driverDeviceMenu).parent().show();

		} else {
		*/
		$($driverDeviceMenu).parent().hide();
		/*}*/


		// Network
		if (profile.driver === 'network') {
			$($driverNetwork).show();
		} else {
			$($driverNetwork).hide();
		}
	}

	/*
	 * render()
	 * @return NULL
	 * General renderer
	 */
	async render() {
		this.renderProfilesMenu();
		this.renderThemesMenu();
		this.renderMappingsMenu();
		this.renderFields();
		this.renderDriversMenu();
		this.renderCSSOverrides();
		await this.rootController.reloadTheme();
		this.bindEvents();
	}

	/*
	 * renderInitial()
	 * @return NULL
	 * Initial render called by rootController
	 */
	async renderInitial() {

		const files = [
			await ojd.fetchFile("./components/profile.view.html")
		];

		$(this.rootId).html("");

		for (const html of files) {
			$(this.rootId).append(html!);
		}

		await this.render();

	}
}

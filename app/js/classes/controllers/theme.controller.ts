import $ from "jquery";
import { ojd } from "../..";
import Profiles from "../profiles.class";
import Themes from "../themes.class";
import RootController from "./root.controller";

/*
	ThemeController
	Handles the rendering the current joystick theme into view.
*/
export default class ThemeController {
	rootId = '#ojd-theme';
	contentsId = '#ojd-theme-contents';
	rootController: RootController;
	themes: Themes;
	profiles: Profiles;
	currentTheme?: string;
	currentThemeStyleId?: number;

	constructor(rootController: RootController) {
		this.rootController = rootController;
		this.themes = rootController.themes;
		this.profiles = rootController.profiles;
	}

	/*
	 * render()
	 * @return NULL
	 * General renderer, gets the current profile theme and loads it into the canvas.
	 */
	async render() {

		const themeId = this.profiles.getCurrentProfileTheme();
		const themeStyleId = this.profiles.getCurrentProfileThemeStyle();

		if (this.currentTheme !== undefined) {
			if (this.currentTheme === themeId && this.currentThemeStyleId === themeStyleId) {
				return; // Don't re-render.
			}
		}

		const theme = await this.themes.getTheme(themeId, themeStyleId);
		if (!theme) {
			let id = this.themes.getDefault();
			this.profiles.setProfileTheme(id);
			this.profiles.setProfileThemeStyle(0);
			//this.rootController.reloadProfile();
			return;
		}

		// Prevent needless rerenders.
		this.currentTheme = themeId;
		this.currentThemeStyleId = themeStyleId;

		// Append CSS
		$('#ojd-theme-stylesheet-style').remove();
		$('#ojd-theme-stylesheet').remove();

		let cssRoot = '';
		try {
			if (theme.styles[themeStyleId].cssroot) {
				cssRoot = theme.styles[themeStyleId].cssroot!;
			}
		} catch {
			cssRoot = '';
		}

		// If the style has a master css file, load that first, otherwise load the base theme.css
		if (theme.styles && theme.styles.length > 0 && theme.styles[themeStyleId] && theme.styles[themeStyleId].mastercss) {
			$('head').append(`<link id="ojd-theme-stylesheet" rel="stylesheet" href="${theme.directory}/${cssRoot}/${theme.styles[themeStyleId].mastercss}" type="text/css" />`);
		} else {
			$('head').append(`<link id="ojd-theme-stylesheet" rel="stylesheet" href="${theme.directory}/${cssRoot}/theme.css" type="text/css" />`);
		}

		// Style of Theme
		if (theme.styles && theme.styles.length > 0 && theme.styles[themeStyleId]) {
			const style = theme.styles[themeStyleId];

			if (await ojd.fetchFile(`${theme.directory}${cssRoot}theme-${style.id}.css`)) {
				$('head').append(`<link id="ojd-theme-stylesheet-style" rel="stylesheet" href="${theme.directory}/${cssRoot}/theme-${style.id}.css" type="text/css" />`);
			}
		}

		// Add Theme
		$(this.contentsId).html(theme.html);

		// Parse SVG Objects
		let svg = "";
		const $svgElements = $(`${this.contentsId} *[ojd-svg]`);
		for (const $e of $svgElements) {
			try {
				const file = await ojd.fetchFile($($e).attr('ojd-svg')!);
				if (!file) throw new Error();
				svg = file
				$($e).html(svg);
			} catch {
				console.error('Cannot read SVG file from element.');
			}
		}

	}

	/*
	 * renderInitial()
	 * @return NULL
	 * Initial render called by rootController
	 */
	renderInitial() {
		this.render();
	}
}


module.exports.ThemeController = ThemeController;

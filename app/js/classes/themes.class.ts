import Config from "./config.class";
import { DataSanitize, DataTheme } from "./data";
import Profiles from "./profiles.class";

import sanitizeJson from "../data/sanitize.json";
import clone from "clone";
import { ojd } from "..";
import sanitize from "sanitize-html";

export default class Themes {
	config: Config;
	profiles: Profiles;
	sanitize: DataSanitize;
	sanitizeTags: string[];
	sanitizeAttributes: { [key: string]: string[] };
	themes: { [key: string]: DataTheme & { directory: string, user?: boolean, html: string } };
	loaded = false;

	constructor(config: Config, profiles: Profiles) {

		this.config = config;
		this.profiles = profiles;
		this.themes = {};

		// HTML Sanitization Configuration
		this.sanitize = sanitizeJson; // Need not clone cuz we are not changing it
		this.sanitizeTags = this.sanitize.tags;
		this.sanitizeAttributes = {};
		for (const attr of this.sanitizeTags) {
			this.sanitizeAttributes[attr] = this.sanitize.attributes;
		}

		this.load();
	}

	async load() {

		this.themes = {};
		const directories = await ojd.listDir("../themes");
		for (const dir of directories) {
			try {
				this.themes[dir] = await ojd.readJson(`../themes/${dir}/theme.json`);
				this.themes[dir].directory = `../themes/${dir}/`
			} catch {
				console.error(`Error loading system theme: ${dir}`);
			}
		}

		const userDirectory = this.config.getUserThemeDirectory();
		if (userDirectory) {
			try {
				const paths = await ojd.listDir(userDirectory);
				for (const dir of paths) {
					try {
						this.themes[dir] = await ojd.readJson(`${userDirectory}/${dir}/theme.json`);
						this.themes[dir].directory = ojd.getEnvPath(`${userDirectory}/${dir}/`);
						this.themes[dir].user = true;
					} catch {
						console.error(`Could not load user theme from directory: ${dir}`);
					}
				}
			} catch {
				console.error("Could not load user themes.");
			}

		}

		this.loaded = true;
	}

	getDefault() {
		return 'ojd-microsoft-xbox';
	}

	async getTheme(id: string, styleKey: number) {
		await this.ensureLoaded();
		const theme = clone(this.themes[id]);
		if (!theme) {
			return false;
		}

		let styleFile: string | undefined;
		if (theme.styles && theme.styles[styleKey] && theme.styles[styleKey].file) {
			styleFile = theme.styles[styleKey].file;
		}

		theme.html = '';
		try {
			let file = '';
			if (styleFile && (await ojd.fetchFile(`${theme.directory}${styleFile}`))) {
				file = (await ojd.fetchFile(`${theme.directory}${styleFile}`))!;
			} else {
				file = (await ojd.fetchFile(`${theme.directory}theme.html`))!;
			}

			theme.html = file;
			theme.html = sanitize(theme.html, {
				allowedTags:this.sanitizeTags,
				allowedAttributes:this.sanitizeAttributes
			});
		} catch(e) {
			console.error(e);
			return false;
		}

		theme.html = theme.html.replace(/%DIRECTORY%/g, theme.directory);

		return theme;

	}

	async setUserThemeDirectory(directory: string) {
		this.config.setUserThemeDirectory(directory);
		await this.load();
	}

	getUserThemeDirectory() {
		return this.config.getUserThemeDirectory();
	}

	getThemes() {
		return this.themes;
	}

	async ensureLoaded() {
		return new Promise<void>(res => {
			const interval = setInterval(() => {
				if (this.loaded) {
					clearInterval(interval);
					res();
				}
			}, 50);
		});
	}
}
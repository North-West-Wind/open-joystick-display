import clone from "clone";
import * as fs from "fs";
import * as path from "path";
import sanitize from "sanitize-html";
import { fileURLToPath } from "url";
import Config from "./config.class.js";
import Profiles from "./profiles.class.js";
import { ojd } from "../global.js";
import { DataSanitize, DataTheme } from "./data.js";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default class Themes {
	config: Config;
	profiles: Profiles;
	sanitize: DataSanitize;
	sanitizeTags: string[];
	sanitizeAttributes: { [key: string]: string[] };
	themes: { [key: string]: DataTheme & { directory: string, user?: boolean, html: string } };

	constructor(config: Config, profiles: Profiles) {

		this.config = config;
		this.profiles = profiles;
		this.themes = {};

		// HTML Sanitization Configuration
		this.sanitize = <DataSanitize>JSON.parse(fs.readFileSync(path.join(__dirname, "../../public/data/sanitize.json"), { encoding: "utf8" }));
		this.sanitizeTags = this.sanitize.tags;
		this.sanitizeAttributes = {};
		for (const attr of this.sanitizeTags) {
			this.sanitizeAttributes[attr] = this.sanitize.attributes;
		}

		this.load();
	}

	load() {

		this.themes = {};
		const directories = fs.readdirSync(path.join(__dirname, "../../public/themes"));
		for (const dir of directories) {
			try {
				this.themes[dir] = JSON.parse(fs.readFileSync(path.join(__dirname, `../../public/themes/${dir}/theme.json`), { encoding: "utf8" }));
				this.themes[dir].directory = path.join(__dirname, "../../public/themes", dir);
			} catch {
				console.error(`Error loading system theme: ${dir}`);
			}
		}

		const userDirectory = this.config.getUserThemeDirectory();
		if (userDirectory) {
			try {
				const paths = fs.readdirSync(userDirectory);
				for (const dir of paths) {
					try {
						this.themes[dir] = JSON.parse(fs.readFileSync(ojd()!.getEnvPath(`${userDirectory}/${dir}/theme.json`), { encoding: "utf8" }));
						this.themes[dir].directory = ojd()!.getEnvPath(`${userDirectory}/${dir}/`);
						this.themes[dir].user = true;
					} catch {
						console.error(`Could not load user theme from directory: ${dir}`);
					}
				}
			} catch {
				console.error("Could not load user themes.");
			}

		}

	}

	getDefault() {
		return 'ojd-microsoft-xbox';
	}

	getTheme(id: string, styleKey: number) {

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
			let file: number;
			if (styleFile && fs.existsSync(`${theme.directory}${styleFile}`)) {
				file = fs.openSync(`${theme.directory}${styleFile}`, 'r');
			} else {
				file = fs.openSync(`${theme.directory}theme.html`, 'r');
			}

			theme.html = fs.readFileSync(file, { encoding: "utf8" });
			fs.closeSync(file);
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

	setUserThemeDirectory(directory: string) {
		this.config.setUserThemeDirectory(directory);
		this.load();
	}

	getUserThemeDirectory() {
		return this.config.getUserThemeDirectory();
	}

	getThemes() {
		return this.themes;
	}

}
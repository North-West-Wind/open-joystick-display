import $ from "jquery";
import * as PATH from "path";
import Config from "./classes/config.class";

/*
	Class OJD
	General tools used globally thoughout OJD.
*/

export default class OJD {
	config?: Config;

	/**
	 * Post constructor bind of configuration class.
	 * @param config
	 */
	setConfig(config: Config) {
		this.config = config;
	}

	/*
	 * isWindows()
	 * @return bool
	 * Determines if the application is running in windows.c
	 */
	isWindows() {
		/*if (process.platform === "win32") {
			return true;
		}*/
		return false;
	}

	/**
	 * Returns the correct pathing style for each OS. Mostly here for windows.
	 * @param path Path
	 * @return Potentially normalized path
	 */
	getEnvPath(path: string) {
		if (this.isWindows()) {
			path = PATH.normalize(path);
		}
		return path;
	}

	/*
	 * escapeText(string)
	 * @param string text
	 * @return string
	 * Returns an escaped string to prevent JS injection.
	 */
	escapeText(text: string) { 
		return $("<div>").text(text).html();
	}

	/*
	 * log()
	 * @param mixed buffer
	 * @return NULL
	 * Enables logging if config.debug = true
	 */

	log(buffer: Buffer) {
		if (this.config!.debugEnabled()) {
			console.log(buffer);
		}
	}

	/**
	 * Validates an float value between a range. Also allows for precision rounding.
	 * @param value Mixed
	 * @param min Float
	 * @param max Float
	 * @param precision Integer
	 * @return Float
	 */
	validateFloat(value: string | number, min: number, max: number, precision: number) {
		if (typeof value === "string") value = parseFloat(value);
		if (value < min) {
			value = min;
		} else if (value > max) {
			value = max;
		}
		if (precision) {

		}
		return value;
	}

	/**
	 * Validates an integer value between a range.
	 * @param value String or number
	 * @param min Integer
	 * @param max Integer
	 * @return Integer
	 */
	validateInteger(value: string | number, min: number, max: number) {
		if (typeof value === "string") value = parseInt(value, 10);
		if (value < min) {
			value = min;
		} else if (value > max) {
			value = max;
		}
		return value;
	}

	// Extra stuff by NorthWestWind
	async readJson(path: string) {
		try {
			const res = await fetch(`http://localhost:3000/file`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ path })
			});
			if (res.ok) return await res.json();
		} catch (err) {
			console.error(err);
		}
		return undefined;
	}

	async fetchFile(path: string) {
		try {
			const res = await fetch(`http://localhost:3000/file`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ path })
			});
			if (res.ok) return await res.text();
		} catch (err) {
			console.error(err);
		}
		return undefined;
	}

	async listDir(path: string) {
		try {
			const res = await fetch(`http://localhost:3000/list`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ path })
			});
			if (res.ok) return await res.json();
		} catch (err) {
			console.error(err);
		}
		return undefined;
	}
}
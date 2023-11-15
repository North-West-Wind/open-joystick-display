import * as PATH from "path";
import Config from "./classes/config.class.js";

/*
	Class OJD
	General tools used globally thoughout OJD.
*/

export class OJD {
	cwd: string;
	config?: Config;

	/*
	 * constructor(cwd)
	 * @param string cwd
	 * @param object config
	 * @return OJD
	 * OJD Class constructor. Sets the CWD application wide.
	 */
	constructor(cwd: string) {
		this.cwd = this.getEnvPath(cwd.replace('app/views', '').replace('app\\views', ''));
	}

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
		if (process.platform === "win32") {
			return true;
		}
		return false;
	}

	/*
	 * getCwd()
	 * @return string
	 * Gets the current working directory of the application. Set in index.js.
	 */
	getCwd() {
		return this.cwd;
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

	/**
	 * Returns path from the current working directory.
	 * @param path Path
	 * @return Path from the current working directory.
	 */
	appendCwdPath(path: string) {
		const cwd = this.getCwd();
		let cwdPath = `${cwd}/${path}`;
		cwdPath = this.getEnvPath(cwdPath);
		return cwdPath;
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

}
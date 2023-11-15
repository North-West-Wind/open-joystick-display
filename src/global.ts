import { OJD } from "./ojd.js";

export const PACKAGE_NAME = "open-joystick-display-transparent";

let ojdVar: OJD;
export function ojd(o?: OJD) {
	if (o) ojdVar = o;
	return o;
}

let ojdMappings;
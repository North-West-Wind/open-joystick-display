export default abstract class RetroSpyDevice {
	joystick: { axes: number[], buttons: { pressed: boolean, value: number }[] };
	joystickInfo: string;
	buttonMap!: number[];
	axisMap!: number[];

	constructor(axes: number, buttons: number, joystickInfo: string) {
		this.joystick = {
			axes: Array(axes).fill(0),
			buttons: Array(buttons).fill({ pressed: false, value: 0 })
		}
		this.joystickInfo = joystickInfo;
	}

	resetJoystick() {
		// Emulates Chromium Gamepad Model
		this.joystick = {
			axes: Array(this.joystick.axes.length).fill(0),
			buttons: Array(this.joystick.buttons.length).fill({ pressed: false, value: 0 })
		}
	}

	getJoystick() {
		return this.joystick;
	}

	getInformation() {
		return this.joystickInfo;
	}

	abstract read(line: string): void;
}

export abstract class RetroSpyAxisDevice extends RetroSpyDevice {
	axisMapInverted!: boolean[];
	axisMapOffset!: number;
	axisMapByteLength!: number;

	readAxis(buffer: string, bufferIndex: number, inverted: boolean) {

		let axisValue = buffer.substring(this.axisMapOffset+bufferIndex, this.axisMapOffset+bufferIndex+this.axisMapByteLength);

		axisValue = axisValue.replace(/\0/g, '0'); // Convert to Binary
		let axisValueNum = parseInt(axisValue, 2); // Convert to Base 10

		if (!isNaN(axisValueNum)) {
			axisValueNum = (axisValueNum - 128) / 128; // Get Value
			if (inverted) {
				axisValueNum = axisValueNum *-1;
			}
			return axisValueNum;
		} else {
			return 0.0;
		}

	}
}
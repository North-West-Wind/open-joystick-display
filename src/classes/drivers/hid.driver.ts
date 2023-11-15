import clone from "clone";
import * as hid from "node-hid";
import Driver from "../driver.class.js";
import Joystick from "../joystick.class.js";

// Work in progress. Not ready.
export default class HIDDriver extends Driver {
	ports: { value: string, label: string }[];
	joystickConnected: boolean;
	joystickIndex?: number;

	constructor(handler: Joystick) {
		super(handler);
		// Joystick Properties
		this.joystickConnected = false;

		this.ready = true;

		// Load Event Listeners
		this.ports = [];

		// Load Ports
		this.initPorts();

	}

	setActive() {
		// Do nothing.
	}

	setInactive() {
		// Do nothing.
	}

	connectJoystick(e: GamepadEvent) {
		if (!this.joystickConnected) {
			const joystick = navigator.getGamepads()[e.gamepad.index]!;
			this.joystickConnected = true;
			this.joystickIndex = e.gamepad.index;
			this.joystickInfo = `${joystick.id}: ${joystick.buttons.length} Buttons, ${joystick.axes.length} Axes.`;
		}
	}

	disconnectJoystick() {
		this.joystickIndex = undefined;
		this.joystickConnected = false;
		this.joystickInfo = '';
	}

	isConnected() {
		return this.joystickConnected;
	}

	getJoystick() {
		if (this.joystickConnected) {
			return navigator.getGamepads()[this.joystickIndex!];
		}
		return null;
	}

	getInformation() {
		if (this.joystickConnected) {
			return this.joystickInfo;
		} else {
			return 'No joystick connected. Please connect a joystick and press a button to activate.';
		}
	}

	getPorts() {
		return this.ports;
	}

	getDevices() {
		return null;
	}

	async initPorts() {
		const ports = hid.devices();
		console.log(ports);
		for (const port of ports) {
			this.ports.push({
				value: port.path!,
				label: port.path!
			});
		}

		return true;
	}

}
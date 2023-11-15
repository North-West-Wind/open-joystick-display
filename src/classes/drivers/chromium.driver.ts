import Driver from "../driver.class.js";
import Joystick from "../joystick.class.js";

export default class ChromiumDriver extends Driver {
	joysticks: { connected: boolean, index: number, info: string }[];
	player: number;

	constructor(handler: Joystick) {
		super(handler);
		// Joystick Properties
		this.joysticks = [
			{ connected: false, index: 0, info: '' },
			{ connected: false, index: 1, info: '' },
			{ connected: false, index: 2, info: '' },
			{ connected: false, index: 3, info: '' },
		];

		this.player = 0;

		this.ready = true;

		//window.addEventListener("gamepadconnected", this.connectJoystick.bind(this));
		//window.addEventListener("gamepaddisconnected", this.disconnectJoystick.bind(this));

	}

	setActive() { }
	setInactive() { }

	connectJoystick(e: GamepadEvent) {
		const joystick = navigator.getGamepads()[e.gamepad.index]!;
		this.joysticks[e.gamepad.index] = {
			connected: true,
			index: e.gamepad.index,
			info: `Player ${e.gamepad.index} - ${joystick.id}: ${joystick.buttons.length} Buttons, ${joystick.axes.length} Axes.`
		};
	}

	disconnectJoystick(e: GamepadEvent) {
		this.joysticks[e.gamepad.index] = { connected: false, index: e.gamepad.index, info: '' };
	}

	isConnected() {
		return this.joysticks[this.player].connected;
	}

	getJoystick() {
		if (this.joysticks[this.player].connected) {
			return navigator.getGamepads()[this.player];
		}
		return null;
	}

	getInformation() {
		if (this.joysticks[this.player].connected) {
			return this.joysticks[this.player].info;
		} else {
			return 'No joystick connected. Please connect a joystick and press a button to activate.';
		}
	}

	async initPorts() {
		return true;
	}

	getPorts() {
		return null;
	}

	getDevices() {
		return null;
	}

}
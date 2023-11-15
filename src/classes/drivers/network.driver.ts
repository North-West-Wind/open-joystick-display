import clone from "clone";
import JsonSocket from "json-socket";
import { Socket } from "net";
import Driver from "../driver.class.js";
import Joystick from "../joystick.class.js";

type JoystickState = { connected: boolean, axes: [], buttons: [] };

// Handles OJD server requests from another PC.
export default class NetworkDriver extends Driver {
	driverActive: boolean;
	joystickDefault: JoystickState;
	joystick: JoystickState & { id?: string };
	joystickConnected: boolean;
	host?: string;
	port: number;
	socket?: JsonSocket;

	constructor(handler: Joystick) {
		super(handler);
		// Joystick Properties
		this.driverActive = false;
		this.joystickDefault = { connected: false, axes: [], buttons: [] };
		this.joystick = clone(this.joystickDefault);
		this.joystickConnected = false;

		this.ready = true;
		this.port = 56709;
	}

	setActive(networkHost: string) {
		this.host = networkHost;
		this.driverActive = true;
		this.socket = new JsonSocket(new Socket());

		this.socket.on('error', function (err) {
			console.warn(`Socket Error: ${err.message}`);
		});

		this.socket.on('connect', () => {
			this.checkJoystick();
		});

		this.socket.on('message', (response) => {
			if (response && response.connected) {
				this.joystick = response;
				if (!this.joystickConnected) {
					this.joystickConnected = true;
					this.joystickInfo = `${this.joystick.id}: ${this.joystick.buttons.length} Buttons, ${this.joystick.axes.length} Axes.`;
				}
			} else {
				this.joystick = clone(this.joystickDefault);
				this.joystickConnected = false;
				this.joystickInfo = '';
			}
			this.checkJoystick();
		});

		this.socket.connect(this.port, this.host);

	}

	setInactive() {
		this.driverActive = false;
		this.joystick = clone(this.joystickDefault);
		this.joystickConnected = false;
		this.joystickInfo = '';
		this.host = undefined;
		this.socket = undefined;
	}

	checkJoystick() {
		this.socket!.sendMessage({ getController: true }, console.error);
	}

	doSleep(ms: number) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	isConnected() {
		return this.joystickConnected;
	}

	getJoystick() {
		if (this.joystickConnected) {
			return this.joystick;
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
		return null;
	}

	getDevices() {
		return null;
	}

	async initPorts() {
		return true;
	}

}
import clone from "clone";
import Joystick from "../joystick.class";
import { decode, encode } from "msgpack-lite";

type JoystickState = { connected: boolean, axes: number[], buttons: { pressed: boolean, value: number }[] };

// Handles OJD server requests from another PC.
export default class NetworkDriver {
	handler: Joystick;
	joystickInfo: string;
	ready?: boolean;
	player?: number;
	driverActive: boolean;
	joystickDefault: JoystickState;
	joystick: JoystickState & { id?: string };
	joystickConnected: boolean;
	host?: string;
	port: number;
	websocket?: WebSocket;

	constructor(handler: Joystick) {
		this.handler = handler;
		this.joystickInfo = "";
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
		this.websocket = new WebSocket(`ws://localhost:8080`);
		this.websocket.binaryType = "arraybuffer";
		this.websocket.onopen = () => {
			this.websocket?.send(encode({ type: "details", data: { port: this.port, host: this.host } }));
		};
		this.websocket.onmessage = (ev) => {
			const msg = decode(new Uint8Array(ev.data));
			switch (msg.type) {
				case "error": {
					console.warn(`Socket Error: ${msg.data.error.message}`);
					break;
				}
				case "message": {
					const response = msg.data.message;
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
				}
			}
		};

	}

	setInactive() {
		this.driverActive = false;
		this.joystick = clone(this.joystickDefault);
		this.joystickConnected = false;
		this.joystickInfo = '';
		this.host = undefined;

		this.websocket?.close();
		this.websocket = undefined;
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
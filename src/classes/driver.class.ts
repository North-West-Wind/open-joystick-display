import Joystick from "./joystick.class.js";

export default abstract class Driver {
	handler: Joystick;
	joystickInfo: string;
	ready?: boolean;
	player?: number;

	constructor(handler: Joystick) {
		this.handler = handler;
		this.joystickInfo = "";
	}


	abstract setActive(...args: string[]): void;
	abstract setInactive(): void;
	abstract initPorts(): Promise<boolean>;

	abstract getPorts(): { value: string, label: string }[] | null;
	abstract getDevices(): { value: string, label: string }[] | null;
	abstract getJoystick(): { buttons: { pressed: boolean, value: number }[], axes: number[] } | Gamepad | null;
	abstract getInformation(): string;
	abstract isConnected(): boolean;
}
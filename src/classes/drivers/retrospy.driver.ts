import { ReadlineParser, SerialPort } from "serialport";
import Driver from "../driver.class.js";
import Joystick from "../joystick.class.js";
import RetroSpyDevice from "../device.class.js";
import RetroSpyDevice_GC from "./retrospy/retrospy-gc.device.js";
import RetroSpyDevice_MD from "./retrospy/retrospy-md.device.js";
import RetroSpyDevice_N64 from "./retrospy/retrospy-n64.device.js";
import RetroSpyDevice_NES from "./retrospy/retrospy-nes.device.js";
import RetroSpyDevice_PCE from "./retrospy/retrospy-pce.device.js";
import RetroSpyDevice_SMASHBOX from "./retrospy/retrospy-smashbox.device.js";
import RetroSpyDevice_SNES from "./retrospy/retrospy-snes.device.js";

/*
	RetroSpyDriver
	Handles the RetroSpy responses from the serial device firmware. Converts them into a standard
	chromium gamepad response to be used with the existing input mapper.

	Original implementation:
	Original NintendoSpy implementation by Jeremy Burns (jaburns). https://github.com/jaburns/NintendoSpy
	RetroSpy fork by Christopher J. Mallery (zoggins). https://github.com/zoggins/RetroSpy

	RetroSpy Copyright 2018 Christopher J. Mallery <http://www.zoggins.net> NintendoSpy Copyright (c) 2014 Jeremy Burns
	LICENSE: https://github.com/zoggins/RetroSpy/blob/master/LICENSE

	Open Joystick Display implementation:
	Port by Anthony 'Dragoni' Mattera (RetroWeeb) https://github.com/RetroWeeb
	Copyright 2019 Open Joystick Display Project, Anthony 'Dragoni' Mattera (RetroWeeb)
	LICENSE: https://ojdproject.com/license

*/
export default class RetroSpyDriver extends Driver {
	joystickConnected: boolean;
	ports: { value: string, label: string }[];
	baud: number;
	port?: string;
	socket?: SerialPort;
	device?: RetroSpyDevice;
	devices: { [key: string]: RetroSpyDevice };

	constructor(handler: Joystick) {
		super(handler);
		this.joystickConnected = false;
		this.handler = handler;

		// RetroSpy Settings
		this.ports = [];
		this.ready = false;
		this.baud = 115200;

		// List of Support Device Parsers
		this.devices = {
			'nes': new RetroSpyDevice_NES(),
			'snes': new RetroSpyDevice_SNES(),
			'smashbox': new RetroSpyDevice_SMASHBOX(),
			'n64': new RetroSpyDevice_N64(),
			'gc': new RetroSpyDevice_GC(),
			'md': new RetroSpyDevice_MD(),
			'pce': new RetroSpyDevice_PCE()
		};

		// Get Serial Ports
		this.initPorts();

	}

	setActive(port: string, device: string) {

		// Sanity Checking
		if (port === '') {
			return false;
		}

		if (device === '') {
			return false;
		}

		// Setup Devices
		this.port = port;
		this.device = this.devices[device];
		this.device.resetJoystick();

		// Make Serial Connection
		this.socket = new SerialPort({ path: this.port, baudRate: this.baud, autoOpen: true }, err => {
			if (err) {
				console.info(`RetroSpy: ${err}`);
			}
		});

		// On Disconnect Refresh Driver
		this.socket.on('err', () => {
			if (this.joystickConnected) {
				console.info('RetroSpy: Reloading Driver');
				this.handler.reloadDriver();
			}
		});

		// Send Information to Parser
		const parser = this.socket.pipe(new ReadlineParser({ delimiter: '\n' }))
		parser.on('data', data => {
			this.device!.read(data);
		});

		this.joystickConnected = true;

	}

	setInactive() {
		this.joystickConnected = false;
		this.port = undefined;

		if (this.socket && this.socket.isOpen) {
			this.socket.close();
		}

		this.socket = undefined;
	}

	isConnected() {
		return this.joystickConnected;
	}

	getInformation() {
		if (this.device && this.port) {
			return `Connected on ${this.port}: ${this.device.getInformation()}.`
		} else {
			return "RetroSpy is not connected. Check your arduino installation, your firmware, your serial port, your cable, and if your console is currently on.";
		}
	}

	getJoystick() {
		if (this.device && this.port) {
			return this.device.getJoystick();
		} else {
			return { buttons: [], axes: [] };
		}
	}

	getPorts() {
		return this.ports;
	}

	getDevices() {
		return [
			{ value: 'nes', label: 'Nintendo Famicom (NES)' },
			{ value: 'snes', label: 'Nintendo Super Famicom (SNES)' },
			{ value: 'smashbox', label: 'Hit Box Smash Box' },
			{ value: 'n64', label: 'Nintendo 64' },
			{ value: 'gc', label: 'Nintendo Gamecube' },
			{ value: 'pce', label: 'NEC PC-Engine / TurboGrafx-16' },
			{ value: 'md', label: 'Sega Master System / Mega Drive (Genesis)' }
		];
	}

	async initPorts() {
		this.ports = [];

		try {
			const ports = await SerialPort.list();

			for (const port of ports) {
				let name = port.path;

				if (typeof port.pnpId !== 'undefined') {
					name = `${name} (${port.pnpId})`;
				}

				this.ports.push({
					value: port.path,
					label: name
				});
			}

			this.ready = true;

		} catch (err) {
			console.error("RetroSpy: Could not access serial device. Maybe you need to give yourself permissions or run as administrator?");
		}

		return true;

	}

}

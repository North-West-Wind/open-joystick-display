export type DataConfig = {
	version: number;
	bounds: {
		x: number;
		y: number; 
		height: number; 
		width: number;
	};
	devTools: boolean;
	broadcast: boolean;
	profile: number;
	locale: string;
	
	// Version 0 stuff
	theme?: any;
	map?: any;
	chroma?: any;
	chromaColor?: any;
	alwaysOnTop?: any;
	zoom?: any;
	mappings?: any;
}

export type DataConfigBounds = {
	x: number;
	y: number; 
	height: number; 
	width: number;
};

export type DataMapping = {
	name: string;
	button: DataMappingButton[];
	directional: DataMappingDirectional[];
	trigger: DataMappingTrigger[];
	triggerFixed: any[]; // i don't know what this does
}

export type DataMappingButton = {
	button: string;
	index: number;
}

export type DataMappingDirectional = {
	deadzone: number;
	analog?: boolean;
	axes: number[]; // length 2
	infinity?: boolean;
	invertX?: boolean;
	invertY?: boolean;
	dpad?: boolean;
	cpad?: boolean;
}

export type DataMappingTrigger = {
	axis: number;
	range: number[]; // length 2
	invert?: boolean;
	degrees?: number;
	button?: false | string;
}

export type DataProfile = {
	name: string;
	bounds: DataConfigBounds;
	boundsLock: boolean;
	map: number;
	chroma: boolean;
	chromaColor: string; // hex color: #abcdef
	alwaysOnTop: boolean;
	theme: string;
	themeStyle: number;
	zoom: number;
	poll: number;
	driver: string;
	driverPort: string;
	driverDevice: string;
	driverUri: string;
	player?: number;
}

export type DataSanitize = {
	tags: string[];
	attributes: string[];
}

export type DataTheme = {
	id: string;
	name: string;
	author: string;
	version: string;
	copyright: string;
	license: string;
	website: string;
	styles: DataThemeStyle[];
}

export type DataThemeStyle = {
	id: string;
	name: string;
	file?: string;
	mastercss?: string;
	cssroot?: string;
}
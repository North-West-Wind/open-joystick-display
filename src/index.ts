import express from "express";
import { AddressInfo } from "net";
import * as path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (_req, res) => {
	res.sendFile(path.join(__dirname, "../public/views/index.view.html"))
});

const port = 3000;

const server = app.listen(port, () => {
	const info = <AddressInfo>server.address();
	console.log(`Server listening on port ${info.port}`);
});

// OJD setup
import Config from "./classes/config.class.js";
import { OJD } from "./ojd.js";
import { ojd } from "./global.js";
import Mappings from "./classes/mappings.class.js";
import Profiles from "./classes/profiles.class.js";
import Joystick from "./classes/joystick.class.js";
import Themes from "./classes/themes.class.js";

const ojdVar = <OJD>ojd(new OJD(__dirname));

const config 			= new Config();
	ojdVar.setConfig(config);
const mappings  		= new Mappings(config);
const profiles  		= new Profiles(config, mappings);
const joystick  		= new Joystick(config, profiles);
const themes 			= new Themes(config, profiles);
//const rootController 	= new RootController(config, themes, mappings, joystick, profiles);
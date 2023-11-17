// This file handles the json-socket and client can connect with websocket
import cors from "cors";
import "dotenv/config";
import express from "express";
import * as fs from "fs";
import JsonSocket from "json-socket";
import { decode, encode } from "msgpack-lite";
import { Socket } from "net";
import path from "path";
import { WebSocketServer } from "ws";

const server = new WebSocketServer({ port: 8080, clientTracking: true });
let socket: JsonSocket | undefined;

server.on("connection", (client) => {
	client.binaryType = "arraybuffer";
	client.on("message", (message: ArrayBuffer) => {
		const msg = decode(new Uint8Array(message));
		if (msg.type === "details") {
			if (socket) {
				socket.end();
				socket = undefined;
			}
			createJsonSocket();
			socket!.connect(msg.data.port, msg.data.host);
		}
	});
	client.on("close", () => {
		if (server.clients.size == 0) {
			socket?.end();
			socket = undefined;
		}
	});
});

function createJsonSocket() {
	socket = new JsonSocket(new Socket());

	socket.on('error', function (error) {
		server.clients.forEach(client => client.send(encode({ type: "error", data: { error } })));
		console.warn(`Socket Error: ${error.message}`);
	});

	socket.on('connect', () => {
		socket!.sendMessage({ getController: true }, console.error);
	});

	socket.on('message', (message) => {
		server.clients.forEach(client => client.send(encode({ type: "message", data: { message } })));
		socket!.sendMessage({ getController: true }, console.error);
	});
}

// Express server for serving files
const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.post("/file", (req, res) => {
	let p: string;
	if (req.body.path.startsWith("/")) p = req.body.path;
	else p = path.join(__dirname, "../app/views", req.body.path);
	if (!fs.existsSync(p)) res.sendStatus(404);
	else res.sendFile(p);
});

app.post("/list", (req, res) => {
	let p: string;
	if (req.body.path.startsWith("/")) p = req.body.path;
	else p = path.join(__dirname, "../app/views", req.body.path);
	if (!fs.existsSync(p)) res.sendStatus(404);
	else res.json(fs.readdirSync(p));
});

// Limited to localhost, so requests from other devices can't read your fs with these endpoints
app.listen(parseInt(process.env.PORT || "3000"), process.env.ADDRESS || "localhost");
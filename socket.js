import { Server } from "socket.io";

const allowedOrigins = ["http://localhost:3000", "https://healthdb-admin.vercel.app", "http://192.168.0.101:3000"];

export const attachSocket = (server, app) => {

	const io = new Server(server, {
		cors: {
			origin: allowedOrigins,
			methods: ["GET", "POST"]
		}
	});


	return io.on('connection', (socket) => {
		console.log('Dashboard connected: Real time updates enabled!');

		socket.on('disconnect', () => {
			console.log('Dashboard disconnected');
		});

		app.set('socket', socket) //make socket global
	})


}


export default {
	attachSocket,
};
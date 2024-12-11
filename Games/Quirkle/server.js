const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 5500 });

clients = [];
const players_info = [
	{
		name: '',
		color: 'blue',
		computer: true
	},
	{
		name: 'Thilo',
		color: 'green',
		computer: true
	},
	{
		name: 'Apo',
		color: 'red',
		computer: true
	},
	{
		name: 'Douglas',
		color: 'orange',
		computer: true
	}
]

server.on('connection', socket => {
	if (clients.length >= 4) 
		return;
	clients.push({ socket: socket, ready: false });

	console.log(clients)

	server.clients.forEach(c => { 
		if (c.readyState == WebSocket.OPEN)
			c.send(JSON.stringify({ type: 'setup', ready_arr: clients.map(c => c.ready) }));
	});

	socket.on('message', message => {
		const data = JSON.parse(message);
		if (data.type == 'ready') {
			for (let i = 0; i < clients.length; i++)
				if (clients[i].socket == socket)
					clients[i].ready = true;

			server.clients.forEach(c => { 
				if (c.readyState == WebSocket.OPEN)
					c.send(JSON.stringify({ type: 'ready', ready_arr: clients.map(c => c.ready), players_info: players_info })); 
			});
		} else if (data.type == 'name') {
			for (let i = 0; i < clients.length; i++) {
				if (clients[i].socket == socket) {
					players_info[i].name = data.name;
					players_info[i].computer = false;
				}
			}
		} else if (data.type == 'update') {
			server.clients.forEach(c => { 
				if (c.readyState == WebSocket.OPEN)
					c.send(JSON.stringify({ type: 'update', grid: data.grid, players: data.players, turn: data.turn }));
			});
		}
	});

	socket.on('close', () => {
		clients = clients.filter(client => client.socket !== socket);
		server.clients.forEach(c => { 
			if (c.readyState == WebSocket.OPEN)
				c.send(JSON.stringify({ type: 'setup', ready_arr: clients.map(c => c.ready) }));
		});
	});
});
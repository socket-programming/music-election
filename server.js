'use strict';

const Hapi                 = require('hapi');
const Hoek                 = require('hoek');
const path                 = require('path');
const Sequelize            = require('sequelize');
const server               = new Hapi.Server();
const DBManager            = require('./src/lib/DBManager');
const SocketManager        = require('./src/lib/SocketManager');
const defaultCookieOptions = {password: 'ajcanskjdfnsaklcfklakmfls', isSecure: false};

server.connection({port: 3000});
server.start(() =>  { console.log('Server running at:', server.info.uri); });

server.register(
	require('vision'),
	err =>
	{

		Hoek.assert(!err, err);

		server.views({
			engines       : {
				jade: require('jade')
			},
			path          : path.join(__dirname, 'src', 'views'),
			helpersPath   : 'helpers',
			context       : {
				title: 'Vote your taste!'
			},
			compileOptions: {
				pretty: true
			}
		});
	}
);

server.register(
	require('hapi-auth-cookie'),
	err =>
	{
		server.auth.strategy('session', 'cookie', Hoek.merge({redirectTo: '/login'}, defaultCookieOptions));
	}
);

server.register(
	require('inert'),
	err =>
	{

		if (err) {
			throw err;
		}

		server.route({
			 method : 'GET',
			 path   : '/{param*}',
			 handler: {
				 directory: {
					 path: 'web'
				 }
			 }
		 });
	}
);

server.register(
	{
		register: require('hapi-router'),
		options : {
			routes: 'src/routes/*Route.js'
		}
	},
	err =>
	{
		if (err)
		{
			throw err;
		}
	}
);

const dbManager     = new DBManager(server);
const socketManager = new SocketManager(server);
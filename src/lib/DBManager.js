function DBManager(server)
{
	this.registerPlugin(server);
};

;
DBManager.prototype.registerPlugin = function (server)
{
	server.register(
		{
			register: require('hapi-sequelize'),
			options : {
				database : 'music_election',
				user     : process.env.MYSQL_USER,
				pass     : process.env.MYSQL_PASS,
				dialect  : 'mysql',
				models   : 'src/models/**/*.js',
				sequelize: {
					define : {underscoredAll: true},
					storage: 'app/data/database.sqlite'
				}
			}
		},
		err =>
		{
			if (err)
			{
				throw err;
			}

			this.registerMethods(server);
		}
	);
};

DBManager.prototype.registerMethods = function (server)
{
	var db = server.plugins['hapi-sequelize'].db;

	server.method('getDB', () => db);
	server.method(
		'getModel',
		(modelName) =>
		{
			if (modelName)
			{
				return db.sequelize.models[modelName];
			}
			else {
				return db.sequelize.models;
			}
		}
	);

	this.bootstrapDB(server);
};

DBManager.prototype.registerExtension = function (server)
{
	server.ext(
		'onPreHandler',
		(modelCollections =>
		{
			return (request, reply) =>
			{
				request.models = modelCollections;
				reply.continue();
			}
		})(server.plugins['hapi-sequelize'].db.sequelize.models)
	);
};

DBManager.prototype.bootstrapDB = function (server)
{

	var db    = server.methods.getDB();
	var music = server.methods.getModel('music');

	db.sequelize
		.sync({force: false})
		.then(() =>
			  {
				  console.log('models synced');

				  return music.count();
			  })
		.then(result =>
			  {
				  if (result > 0)
				  {
					  return true;
				  }

				  return music.bulkCreate(
					  [
						  {name: 'Tarkan - Kuzu Kuzu'},
						  {name: 'Mark Ronson feat. Bruno Mars - Uptown Funk!'},
						  {name: 'Ed Sheeran - Thinking Out Lout'},
						  {name: 'Wiz Khalifa feat. Charlie Puth - See You Again'},
						  {name: 'Maroon 5 - Sugar'},
						  {name: 'Ellie Goulding - Love Me Like You Do'},
						  {name: 'Walk The Moon - Shut Up And Dance'},
						  {name: 'The Weeknd - Earned It'},
						  {name: 'Hozier - Take Me To Church'},
						  {name: 'Rihanna Kanye West Paul McCartney - Fourfiveseconds'},
						  {name: 'Fetty Wap - Trap Queen'}
					  ]
				  );
			  })
		.catch(err=> { throw new Error(err); })
		.then(() => this.registerExtension(server));
};

module.exports = DBManager;

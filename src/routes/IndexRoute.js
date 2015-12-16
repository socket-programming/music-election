'use strict';
module.exports = [
	{
		method : 'GET',
		path   : '/',
		handler: (request, reply) =>
		{
			let poll = request.models.poll;

			poll.findAll({where: {status: 'active'}})
				.then(
					polls => {
						reply.view('index', {
							polls: polls
						});
					})
				.catch((err) => {
					reply.view('index', {
						polls: polls
					});
				});

		}
	}
];
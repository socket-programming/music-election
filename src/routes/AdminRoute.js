'use strict';

module.exports = [
	{
		method : 'GET',
		path   : '/admin',
		config : {auth: 'session'},
		handler: (request, reply) =>
		{
			let Music    = request.models.music;
			let viewData = {
				title     : 'Admin',
				isLoggedIn: request.auth.isAuthenticated
			};

			Music.findAll()
				.then(musicList => {
					viewData.musicList = musicList;

					return request.models.poll.findAll();
				})
				.then(polls => {
					viewData.polls = polls;
					reply.view('admin', viewData);
				});

		}
	},
	{
		method : 'GET',
		path   : '/admin/poll/publish/{pollId}',
		config : {auth: 'session'},
		handler: (request, reply) =>
		{
			let Poll   = request.models.poll;
			let pollId = request.params.pollId;

			Poll.findOne(
				{
					where: {
						id    : pollId,
						status: 'inactive'
					}
				})
				.then(poll =>  poll.update({status: 'active'}))
				.then(() => {
					reply.redirect('/admin/poll-results/' + pollId);
				})
				.catch(err => {
					console.error(err);
					reply(err)
				});

		}
	},
	{
		method : 'GET',
		path   : '/admin/poll/close/{pollId}',
		config : {auth: 'session'},
		handler: (request, reply) =>
		{
			let Poll   = request.models.poll;
			let pollId = request.params.pollId;

			Poll.findOne(
				{
					where: {
						id    : pollId,
						status: 'active'
					}
				})
				.then(poll =>  poll.update({status: 'closed'}))
				.then(() => {
					reply.redirect('/admin/poll-results/' + pollId);
				})
				.catch(err => {
					console.error(err);
					reply(err)
				});

		}
	},
	{
		method : 'GET',
		path   : '/admin/poll-results/{pollId}',
		config : {auth: 'session'},
		handler: (request, reply) =>
		{
			let Poll        = request.models.poll;
			let PollAnswer  = request.models.poll_answer;
			let PollOptions = request.models.poll_option;
			let pollId      = request.params.pollId;

			let viewData = {};

			Poll.findOne(
				{
					where: {
						id: pollId,

						status: {
							$in: ['active', 'closed']
						}
					}
				})
				.then(poll => {
					if (!poll)
					{
						throw new Error('Not found');
					}

					viewData.poll = poll;

					return PollOptions.findAll(
						{
							where  : {pollId: pollId},
							include: [{all: true, nested: true}]
						});
				})
				.then(pollOptions => {

					viewData.options = pollOptions.sort((a, b) => b.PollAnswers.length - a.PollAnswers.length);

					return PollAnswer.findAll(
						{
							where  : {pollId: pollId},
							include: [{all: true, nested: true}]
						});
				})
				.then(pollAnswers => {
					viewData.logAnswers = pollAnswers.sort((a, b) => b.createdAt - a.createdAt);

					reply.view('admin-poll-results', viewData);
				})
				.catch(err=> {
					console.error(err);
					reply(err);
				});

		}
	},
	{
		method : 'POST',
		path   : '/admin/poll',
		config : {auth: 'session'},
		handler: (request, reply) =>
		{
			let options    = request.payload['poll-options'];
			let pollName   = request.payload['poll-name'];
			let Poll       = request.models.poll;
			let PollOption = request.models.poll_option;
			let Music      = request.models.music;

			let pollOptions = [];

			Poll.create({name: pollName})
				.then(poll => {

					options.forEach(
						musicId => {
							pollOptions.push(
								{
									musicId: musicId,
									pollId : poll.get('id')
								}
							);
						});

					return PollOption.bulkCreate(pollOptions);
				})
				.then(result => {
					reply.redirect('/admin');
				});

		}
	},
	{
		method : 'POST',
		path   : '/admin/music',
		config : {auth: 'session'},
		handler: (request, reply) =>
		{
			let musicName = request.payload['music-name'];
			let Music     = request.models.music;

			Music
				.create({name: musicName})
				.then(music => {
					reply.redirect('/admin');
				});

		}
	},
	{
		method : 'DELETE',
		path   : '/admin/music/delete/{musicId}',
		config : {auth: 'session'},
		handler: (request, reply) =>
		{
			var musicId = request.params.musicId;
			request.models.music.destroy(
				{
					where: {
						id: musicId
					}
				})
				.then(result => {
					reply().code(204);
				})
				.catch(err=> {
					reply(err);
				});
		}
	}
];
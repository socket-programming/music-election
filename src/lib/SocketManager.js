'use strict';

const clientGuest   = new WeakMap();
let serverReference = {};
module.exports      = SocketManager;

function SocketManager(server) {
	/**
	 * We should keep a reference (not copy) to the original server object.
	 */
	serverReference = server;
	this.io          = require('socket.io')(server.listener);
	this.clientGuest = new WeakMap();

	this.io.on('connection', this.onConnection);

}

SocketManager.prototype.onConnection = function (client) {

	client.on('survey-status', (data) => {
		let Poll = serverReference.methods.getModel('poll');

		Poll.findAll({where: {status: 'active'}})
			.then(
				polls => {
					serverReference.render(
						'partials/poll-list',
						{polls: polls},
						(err, rendered) => {

							console.log(err);

							client.broadcast.emit(
								'survey',
								{
									html: rendered
								});
						}
					);
				});
	});

	client.on(
		'vote',
		(data) =>
		{

			let pollId   = data.pollId;
			let optionId = data.pollOptionId;
			let guestId  = clientGuest.get(client);

			let Poll       = serverReference.methods.getModel('poll');
			let PollAnswer = serverReference.methods.getModel('poll_answer');
			let PollOption = serverReference.methods.getModel('poll_option');

			PollAnswer.create({
								  pollId      : pollId,
								  pollOptionId: optionId,
								  guestId     : guestId
							  })
				.then(pollAnswer => {

					client.emit('vote.success');

					PollAnswer.findAll({
										   where  : {pollId: pollId},
										   include: [{all: true, nested: true}]
									   })
						.then(pollAnswers => {

							serverReference.render(
								'partials/vote-log',
								{logAnswers: pollAnswers},
								(err, rendered) => {

									console.log(err);

									client.broadcast.emit(
										'new-guest-vote',
										{
											pollLogHtml: rendered,
											pollId     : pollId
										});
								}
							);

						})
						.catch(err => {
							console.error(err);
						});

					return pollAnswer.getPoll();
				})
				.then(poll => {
					return poll.getPollOptions({include: [{all: true}]});
				})
				.then(pollOptions => {

					serverReference.render(
						'partials/poll-result-list',
						{options: pollOptions.sort((a, b) => b.PollAnswers.length - a.PollAnswers.length)},

						(err, rendered) => {

							if (err)
							{
								throw err;
							}

							client.broadcast.emit(
								'all-votes',
								{
									pollId    : pollId,
									resultHtml: rendered
								});
						});
				})
				.catch(err => {
					if (err)
					{
						console.log(err);
					}
					client.emit('vote.fail', {
						message: 'Bu anket için daha önce zaten bir oy kullanmışsınız'
					});
				});

		}
	);

	client.on(
		'check-in',
		(data) =>
		{
			let Guest = serverReference.methods.getModel('guest');

			Guest.findOne({where: {id: data.id}})
				.then(
					existingGuest =>
					{
						if (existingGuest)
						{

							return existingGuest;
						}
						else {

							return Guest.create();
						}
					}
				)
				.then(guest => {
					clientGuest.set(client, guest.get('id'));
					client.emit('check-in.success', {
						id: guest.get('id')
					});
				})
				.catch(err => { client.emit('check-in.fail', {message: err.message}); });
		}
	);

	client.on(
		'disconnect',
		() =>
		{
			let Guest = serverReference.methods.getModel('guest');

			let id = clientGuest.get(client);

			console.log(`DISCONNECT ${id}`);

			//Guest.destroy({where: {id: id}})
			//	.then(
			//		result => { console.log(result); }
			//	);
		}
	);
};


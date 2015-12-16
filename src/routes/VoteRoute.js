'use strict';
module.exports = [
	{
		method : 'GET',
		path   : '/poll/vote/{pollId}',
		handler: (request, reply) =>
		{
			let pollId     = request.params.pollId;
			let Poll       = request.models.poll;
			let PollOption = request.models.poll_option;
			let Music      = request.models.music;

			let viewData = {};

			Poll.findOne(
				{
					include: [{all: true}],
					where  : {
						id    : pollId,
						status:  {
							$in: ['active', 'closed']
						}
					}
				})
				.then(poll => {
					viewData.poll = poll;
					return poll.getPollOptions({include: [{all: true}]});
				})
				.then(pollOptions => {
					viewData.options = pollOptions;

					reply.view('poll-vote', viewData);
				})
				.catch(
					err =>
					{
						console.error(err);
						reply(err);
					});

		}
	}
];
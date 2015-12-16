'use strict';
module.exports = (sequelize, DataTypes) =>
{
	let PollAnswer = sequelize.define(
		'poll_answer',
		{
			id     : {
				type         : DataTypes.INTEGER,
				primaryKey   : true,
				unique       : true,
				autoIncrement: true
			}
		},
		{
			indexes: [{unique: true, fields: ['pollId', 'guestId']}]
		}
	);

	let Guest = sequelize.models.guest;
	let Poll  = sequelize.models.poll;

	Guest.hasMany(PollAnswer, {as: 'PollAnswers'});
	Poll.hasMany(PollAnswer, {as: 'PollAnswers'});

	PollAnswer.belongsTo(Guest, {as: 'guest'});
	PollAnswer.belongsTo(Poll, {as: 'poll'});

	return PollAnswer;
};
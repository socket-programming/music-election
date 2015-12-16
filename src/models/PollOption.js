'use strict';
module.exports = (sequelize, DataTypes) => {
	let PollOption = sequelize.define(
		'poll_option',
		{
			id: {
				type         : DataTypes.INTEGER,
				primaryKey   : true,
				unique       : true,
				autoIncrement: true
			}
		}
	);

	let Music      = sequelize.models.music;
	let Poll       = sequelize.models.poll;
	let PollAnswer = sequelize.models.poll_answer;

	Poll.hasMany(PollOption, {as: 'PollOptions'});
	Music.hasMany(PollOption, {as: 'PollOptions'});
	PollOption.hasMany(PollAnswer, {as: 'PollAnswers'});

	PollOption.belongsTo(Poll, {as: 'poll'});
	PollOption.belongsTo(Music, {as: 'music'});
	PollAnswer.belongsTo(PollOption, {as: 'poll_option'});

	return PollAnswer;
};

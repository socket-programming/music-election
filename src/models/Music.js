'use strict';

module.exports = (sequelize, DataTypes) =>
{
	return sequelize.define(
		'music',
		{
			id  : {
				type         : DataTypes.INTEGER,
				primaryKey   : true,
				unique       : true,
				autoIncrement: true
			},
			name: {type: DataTypes.STRING}
		}
	);
};
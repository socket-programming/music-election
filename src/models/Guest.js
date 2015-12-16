'use strict';

module.exports = function (sequelize, DataTypes)
{
	return sequelize.define(
		'guest',
		{
			id      : {
				type         : DataTypes.UUID,
				primaryKey   : true,
				unique       : true,
				defaultValue: DataTypes.UUIDV4
			}
		},
		{ paranoid: true }
	);
};
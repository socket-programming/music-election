'use strict';
module.exports = (sequelize, DataTypes) =>
{
	return sequelize.define(
		'poll',
		{
			id    : {
				type         : DataTypes.INTEGER,
				primaryKey   : true,
				unique       : true,
				autoIncrement: true
			},
			name  : {type: DataTypes.STRING},
			status: {
				type        : DataTypes.ENUM('active', 'inactive', 'closed'),
				defaultValue: 'inactive'
			}
		}
	);
};

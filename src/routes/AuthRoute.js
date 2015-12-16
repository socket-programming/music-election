'use strict';

module.exports = [
	{
		method: ['GET', 'POST'],
		path  : '/login',
		config: {
			auth   : {
				mode    : 'try',
				strategy: 'session'
			},
			plugins: {
				'hapi-auth-cookie': {
					redirectTo: false
				}
			},
			handler: (request, reply) =>
			{
				const users = {
					admin: {password: 'qweasd123'}
				};

				if (request.auth.isAuthenticated)
				{
					return reply.redirect('/admin');
				}

				let message = '';
				let account = null;

				if (request.method === 'post')
				{

					if (!request.payload.username || !request.payload.password)
					{

						message = 'Lütfen formdaki tüm alanları doldurun';
					}
					else
					{
						account = users[request.payload.username];

						if (!account)
						{
							message = 'Bu kullanıcı adıyla ilişkili bir hesap bulunamadı';
						}
						else if (account.password !== request.payload.password)
						{
							message = 'Şifre yanlış';
						}
					}
				}

				if (request.method === 'get' || message)
				{
					return reply.view(
						'login',
						{
							title  : 'Sign in',
							message: message
						}
					);
				}

				request.auth.session.set(account);

				return reply.redirect('/admin');
			}
		}
	},
	{
		method : 'GET',
		path   : '/logout',
		config : {auth: 'session'},
		handler: (request, reply) =>
		{
			request.auth.session.clear();
			return reply.redirect('/');
		}
	}
];
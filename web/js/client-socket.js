$(document).ready(
	function ()
	{
		var socket       = io();
		var $btnSendVote = $('.btn-send-answer');

		var checkIn = function ()
		{
			var identifier = localStorage.getItem('identifier');
			socket.emit('check-in', {id: identifier});
		};

		checkIn();

		socket.on(
			'connect',
			function ()
			{
				console.log('connected to the websocket-server');
			}
		);

		socket.on(
			'disconnect',
			function ()
			{
				console.log('disconnect on client');
				localStorage.removeItem('identifier');
			}
		);

		socket.on('survey', function (data) {
			$('.poll-list').html(data.html);
		});

		socket.on(
			'error',
			function (err)
			{
				alert('Bir hata oluştu: ' + err.message);
			}
		);

		socket.on(
			'check-in.fail', function (data)
			{
				console.error(data.message);
			}
		);

		socket.on(
			'check-in.success', function (data)
			{
				localStorage.setItem('identifier', data.id);
				$btnSendVote.prop('disabled', false);
			}
		);

		socket.on(
			'vote.success', function (data)
			{
				alert('Oyunuz başarıyla kaydedildi');
			});

		socket.on(
			'vote.fail', function (data)
			{
				alert(data.message);
			});

		$('.btn-disconnect').on('click', function () {
			socket.disconnect();
		});

		$('.form-vote-music')
			.on(
				'submit',
				function (e)
				{
					var $this    = $(this);
					var pollId   = $this.data('poll-id');
					var optionId = $this.find('input[type=radio]:checked').val();

					socket.emit('vote', {
						pollId      : pollId,
						pollOptionId: optionId
					});

					e.preventDefault();
				}
			);

	});

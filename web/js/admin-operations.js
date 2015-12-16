$(document).ready(function () {
	$('.btn-delete-music').on('click', function (e) {
		var $this  = $(this);
		var method = $this.data('method');
		var action = $this.data('url');

		$.ajax(
			action,
			{
				method: method
			})
			.done(function ()
				  {
					  window.location.reload();
				  });

		e.preventDefault();
	});

	$('.btn-close-poll').on(
		function (e)
		{

		});
});
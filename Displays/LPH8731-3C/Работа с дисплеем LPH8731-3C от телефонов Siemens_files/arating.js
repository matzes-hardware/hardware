$(document).ready(function() {
	var ratingForm = $('div.arating');
	ratingForm.hide();

	$('span#arating').click(function(e) {
		ratingForm.css('left', $(this).parent().parent().width() - ratingForm.width() - 15);
		ratingForm.css('top', -ratingForm.height() - 15);
		ratingForm.fadeToggle('fast');
	});
	$(ratingForm).find('.close').click(function() {
		ratingForm.fadeToggle('fast');
	});
	$(ratingForm).find('.vote').click(function() {

		if ($(ratingForm).find('#dorating').length == 0) {
			return false;
		}
		
		$(this).parent().find('li').removeClass('selected');
		$(this).addClass('selected');

		var votes = new Array();

		var _float = 0;
		var _int = 0;

		$(ratingForm).find('.votes li.selected').each(function(val, elem) {
			votes[$(elem).parent().parent().data('weight')] = $(elem).data('value');
		})
		for (key in votes) {
			key = parseFloat(key);
			votes[key] = parseFloat(votes[key]);
			_int += votes[key] * key;
			_float += key;
		}
		var result = (_float != 0) ? (_int / _float).toFixed(1) : 0;
		var result = result.toString().replace('.0', '');
		$(ratingForm).find('.result-rating').html(result);

	});
	$(ratingForm).find('#resetrating').click(function() {
		$(ratingForm).find('.votes li').removeClass('selected');
		$(ratingForm).find('.result-rating').html('0');
	});
	$(ratingForm).find('#dorating').click(function() {
		var url = location.protocol + '//' + location.host + '/cms/arating/';
		var cid = '';
		var cval = '';
		$(ratingForm).find('.votes li.selected').each(function(val, elem) {
			cid += $(elem).parent().parent().data('id') + ',';
			cval += $(elem).data('value') + ',';
		});

		var data = 'cid=' + cid + '&cval=' + cval + '&additional=' + encodeURIComponent($('textarea#addittext').val()) + '&url=' + encodeURIComponent(location.pathname + location.search);

		$.getJSON(url, data, function(json) {
			alert(json.message);
			if (json.success) {
				$(ratingForm).find('div#buttons').remove();
				$(ratingForm).find('textarea').attr('disabled', true);
				$(ratingForm).find('.close').click();
			}
		});
	});



});
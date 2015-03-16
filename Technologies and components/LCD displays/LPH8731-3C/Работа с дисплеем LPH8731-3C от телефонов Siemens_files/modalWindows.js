var modal = {
	block: null,
	win: null,
	defaultOptions: {
		closeBlockScreen: true,
		closeButton: true,
		cancelButton: false,
		closeEsc: true,
		width: false,
		scroll: false
	},

	resize: function() {
		var maxHeight = window.innerHeight;
		var maxWidth = window.innerWidth;

		var w = this.win.offsetWidth;
		var h = this.win.offsetHeight;



		/*var w1 = window.getComputedStyle(this.win, '').getPropertyValue('width');
		 var h1 = window.getComputedStyle(this.win, '').getPropertyValue('height');
		 */
		modal.win.style.visibility = 'visible';
		modal.win.style.opacity = 1;
		this.win.style.marginLeft = (-w / 2) + 'px';
		if (h > maxHeight) {
			this.win.style.top = '5px';
			this.win.style.position = 'absolute';
			this.block.style.overflowY = 'scroll';
			this.win.style.marginTop = '0px';
		} else {
			this.win.style.marginTop = (-h / 2) + 'px';
			this.win.style.top = '50%';
		}
	},

	createBlock: function(options) {
		this.block = document.createElement('div');
		this.block.className = 'blockscreen';


		if (options.closeEsc) {
			document.documentElement.onkeydown = function(e) {
				if (e.keyCode == 27) modal.close();
			}
		} else {
			document.documentElement.onkeydown = null;
		}

		var beforeWidth = document.body.scrollWidth;
		document.body.style.overflow = 'hidden';
		var afterWidth = document.body.scrollWidth;
		document.body.style.marginRight = (afterWidth - beforeWidth) + 'px';

		document.body.appendChild(this.block);
		if (options.closeBlockScreen) {
			this.block.onclick = function(e) {
				if (e.target === modal.block) modal.close();
			}
		}
	},

	createWindow: function(html, options) {
		this.win = document.createElement('div');
		this.win.className = 'modalwindow';
		this.win.style.visibility = 'hidden';
		this.win.style.opacity = 0;
		this.win.innerHTML = html;
		if (options.width) this.win.style.width = options.width;

		var maxHeight = window.innerHeight;
		var maxWidth = window.innerWidth;

		var images = this.win.getElementsByTagName('img');
		if (typeof images === 'object' && images.length > 0) {
			var img = images[0];
			this.win.style.visibility = 'hidden';

			img.onload = function() {

				var w = modal.win.offsetWidth;
				var h = modal.win.offsetHeight;

				modal.win.style.visibility = 'visible';
				modal.win.style.marginLeft = (-modal.win.offsetWidth / 2) + 'px';

				if (h > maxHeight) {
					modal.win.style.top = '5px';
					modal.win.style.position = 'absolute';
					modal.block.style.overflowY = 'scroll';
				} else {
					modal.win.style.marginTop = (-modal.win.offsetHeight / 2) + 'px';
					modal.win.style.top = '50%';
				}

			}
		}

		if (options.closeButton) {
			var closeButton = document.createElement('div');
			closeButton.className = 'closebutton';
			closeButton.onclick = function() {
				modal.close();
			}
			this.win.appendChild(closeButton);
		}

		this.block.appendChild(this.win);

		var w = this.win.offsetWidth;
		var h = this.win.offsetHeight;

		/*var w1 = window.getComputedStyle(this.win, '').getPropertyValue('width');
		var h1 = window.getComputedStyle(this.win, '').getPropertyValue('height');
		*/
		modal.win.style.visibility = 'visible';
		modal.win.style.opacity = 1;
		this.win.style.marginLeft = (-w / 2) + 'px';
		if (h > maxHeight) {
			this.win.style.top = '5px';
			this.win.style.position = 'absolute';
			this.block.style.overflowY = 'scroll';
		} else {
			this.win.style.marginTop = (-h / 2) + 'px';
			this.win.style.top = '50%';
		}
	},

	open: function(html, options) {
		if (!options) {
			options = this.defaultOptions;
		} else {
			for (var i in this.defaultOptions) {
				if (!options.hasOwnProperty(i)) options[i] = this.defaultOptions[i];
			}
		}

		this.createBlock(options);
		this.createWindow(html, options);
	},
	close: function(animate) {
		animate = !animate;
		document.body.style.overflow = 'auto';
		document.body.style.marginRight =  0;
		this.block.parentNode.removeChild(this.block);
		if (animate) {
			this.win.style.top = '150%';
			this.win.style.opacity = 0;
			setTimeout(function() {
				modal.win.parentNode.removeChild(modal.win);
			}, 300);
		} else {
			this.win.parentNode.removeChild(this.win);
		}
	}

}

window.onload = function() {
	//modal.open('text<br><img src="http://cs319921.vk.me/v319921501/5ab5/T6YVqCs_nEo.jpg">', {closeBlockScreen: true, closeEsc: true});
};


var _modalDialog, _modalBlock;

function mw_createWindow(width, height, position, html) {
    _mw_createWindow(width, height);	
    $('body').append(_modalBlock);
    $('body').append(_modalDialog);
	_modalDialog.append(html);
	_mw_setPosition(position);	
	_mw_showWindow();
}


function _mw_setPosition(position) {	
    if (position == 'center') {
		_modalDialog.css('left', '50%');
		_modalDialog.css('top', '50%');
		_modalDialog.css('margin-left', '-' + (_modalDialog.width() / 2) + 'px');
		_modalDialog.css('margin-top', '-' + (_modalDialog.outerHeight() / 2) + 'px');
	}
}

function _mw_createWindow(width, height) {
    _modalDialog = $('<div>', { id: 'modalDialog',width: width + 'px' });
    _modalBlock = $('<div>', { id: 'modalBlock' });
    _modalDialog.append('<div id="modalClose" onclick="_mw_closeWindow()"></div>');
	//<img src="/images/mode_close_windows.png">
}

function _mw_showWindow() {
    _modalBlock.fadeIn('fast');
    _modalDialog.fadeIn('fast');
	var beforeWidth = document.body.scrollWidth;
	document.body.style.overflow = 'hidden';
	var afterWidth = document.body.scrollWidth;
	document.body.style.marginRight = (afterWidth - beforeWidth) + 'px'
}

function _mw_closeWindow() {
    _modalBlock.fadeOut('fast');
    _modalDialog.fadeOut('fast');
    _modalBlock.remove();
    _modalDialog.remove();
	document.body.style.overflow = 'auto';
	document.body.style.marginRight = 0;
}